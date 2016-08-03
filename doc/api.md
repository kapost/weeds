# API Documentation

## Relevant Tooling

If you are unfamiliar with any of the following—

* redux (and react-redux)
* axios
* react-router
* ES6 promises
* react-resolver

—then you should go back over the tooling and recommended reading sections [in the README](../README.md). Otherwise this documentation will be very difficult to follow.

## Control Flow with with API fetches

Control flow in an universal app can be hard to follow—especially with API requests mixed in. The control flow for this app looks something like this:

### Universal rendering

#### Server

On request:

1. Create redux store
1. Get JWT Auth (with a domain-wide cookie)
1. Find components in route (react router)
    1. Check if you are auth-ed through `Route` hook. If not, redirect to sign-in page.
    1. Fire all AJAX requests specified in react-resolver (automatically added with `generateApiContainer`)
1. Render markup to string with component tree and store contents
1. Return HTML and serialized redux store with response


(this is all done in `server.jsx` and `util/serverHelpers/handleRequest`)

#### Client

1. Rehydrate store with serialized data on window
1. Rehydrate HTML markup through react-resolver data and redux store

(this is all done in `client.jsx`)

### Client-only rendering

1. Create redux store
1. Get JWT Auth (with a domain-wide cookie)
1. Render React app
    1. Check if you are auth-ed through `Route` hook. If not, redirect to sign-in page.
1. Fire all AJAX requests specified in react-resolver (automatically added with `generateApiContainer`)

(this is all done in `client.jsx`)


### Navigating

1. Trigger API fetches on `componentDidMount` in an ApiContainer.


## Building up API usage in Redux

The generators can seem overwhelming, but they serve simple application needs. Let's break down the problem into pieces:

1. I need to fetch data
2. I need to store that data in redux
3. I need to trigger fetches (with error handling) from container components
4. I need to trigger and display all fetch states in my container

### 1. I need to fetch data

You need an ajax library and a url! Axios is a promise-based library. To build URLs and set application defaults, we need the redux store state. So you should generate a ApiHelper whenever you need to make a request.

```js
const apiHelper = createApiHelper(state);
apiHelper.get("/api/users")
  .then(...)
  .catch(...);
```

### 2. I need to store that data in redux

We will need to store the response data somewhere with a reducer. But first, what does that data even look like? Weeds has defined an API object with the following shape:

```js
{
  progress: oneOf(INITIAL, LOADING, LOADED, FAILED), // constants defined in `shared/values/apiProgressValues.js`
  data: oneOfType(object, array)                     // response from api request (`response.data.response`)
  // ... this shape may be updated to have more info from response in future (such as `page`, `httpStatus`, etc)
}
```

This requires a reducer that looks something like this:

```js
const initialState = {
  progress: "INITIAL",
  data: []
};

const LOADING = `${prefix}_LOADING`;
const LOADED  = `${prefix}_LOADED`;
const FAILED  = `${prefix}_FAILED`;

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        progress: "LOADING"
      };
    case LOADED:
      return {
        ...state,
        progress: "LOADED",
        data: action.data
      };
    case FAILED:
      return {
        ...state,
        progress: "FAILED",
        data: action.data
      };
    default:
      return state;
  }
};
```

Since this is generic, we can generate reducers with this shape and apply to the store as many times
as we need.

```js
combineReducers({
  apiReducer1,
  apiReducer2
})
```

Hence the helper `generateFetchReducer`, which will create an API reducer for you.


## 3. I need to trigger fetches (with error handling) from container components

The reducer only gives us the initial state if we don't fire any actions. We first need some constants and action creators for all fetch states.

```js
const LOADING = `${prefix}_LOADING`;
const LOADED = `${prefix}_LOADED`;
const FAILED = `${prefix}_FAILED`;

const setLoading = () => {
  return {
    type: LOADING
  };
};

const setLoaded = (response) => {
  return {
    type: LOADED,
    data: response
  };
};

const setFailed = (response) => {
  return {
    type: FAILED,
    data: response
  };
};
```


Those actions will be dispatched at different points in the fetch request lifecycle. That lifecycle is just another action (async action through redux-thunk, firing off other actions along the way).

```js
const fetchIfNecessary = () => {
  return (dispatch, getState) => {
    const progress = getState().path.to.api.obj.progress

    if (progress === "LOADED" || progress === "LOADING") {
      return Promise.resolve();  // do nothing
    }

    dispatch(setLoading());

    return createApiHelper(getState()).get('/api/v1/something', { optional: 'params' })
      .then((response) => {
        dispatch(setLoaded(response.data.response));
      })
      .catch((response) => {
        dispatch(setFailed(response));
      });
  };
};
```

This set of actions is also very generic, hence `generateFetchActions`.

Promises are used by redux-thunk and react-resolver to manage the async behavior. This action is robust but repetitive. Hence, we made a generator for this as well—`generateFetchActions`.


## 4. I need to trigger and display all fetch states in my container (with server prefetching)

What do we need in a container, exactly?

1. A container component that handles all API states
1. A connection to the redux store to pass down to all dumb components
1. Optional wrapping for pre-fetching data through react-resolver

Let's say we have a nice, dumb component as an entry to our pod feature. We would want nice error handling (like in napa), where we handle loading and failure states.

```js
render() {
  switch (progress) {
    case LOADED:
      return (
        <Component {...this.props}
                   {...this.apiData()} />
      );
    case INITIAL:
    case LOADING:
      return <LoadingComponent />;
    default:
      return <FailedComponent onRetryFetch={this.props.fetchIfNecessary} />;
  }
}
```

Of course, we would need to calculate progress and handle all props. This is also error prone to copy paste for all containers, so we have another generator: `generateApiContainer`. This generates a higher order component.

Now that we have a nice container, we need to connect it to the redux store. This is done through the `connect` function, another HoC function.

This gives us a React component tree something like the following:

```js
<Connect context={store}>
  <ApiContainer {...mapStateToProps()} {...mapDispatchToProps()}>
    <PresentationalComponent {...topLevelProps} {...apiData} />
  </ApiContainer>
</Connect>
```

Note that by default, the ApiContainer is wrapped with a `react-resolver` container that will use `fetchIfNecessary` to prefetch on server. So the final tree looks something like the following:

```js
<Connect context={store}>
  <Resolve fetchIfNecessary={mapDispatchToProps().fetchIfNecessary}>
    <ApiContainer {...mapStateToProps()} {...mapDispatchToProps()}>
      <PresentationalComponent {...topLevelProps} {...apiData} />
    </ApiContainer>
  </Resolve>
</Connect>
```

Here's an example with it all wired up:

```js
import { connect } from "react-redux";

import generateApiContainer from "shared/components/helpers/generateApiContainer";

import { fetchIfNecessary as usersFetch } from "./actions/userActions";
import Plans from "./components/users";

// Function to fire all fetches. If you need more than one fetch, you can wrap all dispatches in a
// `Promise.all`.
const fetchAllIfNecessary = (dispatch, ownProps) => {
  return dispatch(usersFetch(ownProps));
};

// Pass down any redux state to children (including API objects)
const mapStateToProps = (state) => {
  return {
    users: state.users
  };
};

// Connect dispatching actions here. ApiContainer requires a `fetchIfNecessary` function.
// You can also pass through `ownProps` if your fetchIfNecessary action needs props (useful for
// nested ApiContainers that use IDs, etc to fetch)
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchIfNecessary: () => fetchAllIfNecessary(dispatch, ownProps)
  };
};

// Generate container with class name and API object keys from `mapStateToProps`.
// The container will extract data from the specified API object keys and pass that down.
export const PlansContainer = generateApiContainer(
  "weeds-users-container-component",
  { requiredApiKeys: ["users"] }
)(Plans);

// Connect to redux store for data and fetch actions
export default connect(mapStateToProps, mapDispatchToProps)(PlansContainer);
```

## Fetch Generators

Wrapping up—if you are building a standard container with API access, then you will want to use the following generator functions to wire them up.

* `createApiHelper`
* `generateApiProgressActions`
* `generateFetchActions`
* `generateFetchReducer`
* `generateApiContainer`

Remember, these generators were built for the following needs:

1. I need to fetch data (`createApiHelper`)
1. I need to store that data in redux (`generateApiProgressActions` and `generateFetchReducer`)
1. I need to trigger fetches (with error handling) from container components (`generateFetchActions`)
1. I need to trigger and display all fetch states in my container (with server prefetching) (`generateApiContainer`)


---


## Create, Update, and Delete (*Write*) Generators

For most features, you will also need to fire create, update, and delete actions to update over the API. These are abstracted into *write* actions and reducers in our app. Similar to the fetch generators, these are abstracted into a couple generators:

* `generateWriteAction`
* `generateWriteReducer`

Remember the purpose of each function:

1. I need to send a create, update, or delete request (`generateWriteAction`).
1. I need to store the results of the response (with error handling) (`generateWriteReducer`).

You can generate as many write actions and reducers as you need for a feature, just ensure that the prefixes are unique.

You will very likely want the fetch reducer and the write reducer to change the same ApiObject in the store. `combineReducers` will not do what you want here as it will create *separate* objects in the store. Instead, you should use the helper `reduceReducers` which combines the objects from multiple reducers into one. See the Documentation and examples below for usage.

---


## Documentation

### `createApiHelper`

```js
import createApiHelper from "util/universalHelpers/createApiHelper";
```

| Argument   | Type / Description                                             |
|:-----------|:---------------------------------------------------------------|
| 1) `state` | Redux state from `getState()` call (uses profile data for API) |

Returns: `axios` instance with defaults for api request, including JWT token and timeout.

You should use this for all requests in the app.

```js
createApiHelper(getState())

createApiHelper(getState).get("/api/v1/myCoolApi");
createApiHelper(getState).put("/api/v1/myOtherCoolApi");
```

---

### `generateFetchActions`

```js
import generateFetchActions from "shared/actions/helpers/generateFetchActions";
```

| Argument                  | Type / Description                                                                                                             |
|:--------------------------|:-------------------------------------------------------------------------------------------------------------------------------|
| 1) `prefix`               | App-wide unique prefix for generated actions constants.                                                                        |
| 2) `storePath`            | Path to API object in store (example: `team.groups`)                                                                           |
| 3) `generateFetchPromise` | Function that returns api promise. It is passed `getState` and `data` (data from the fetch call, i.e. fetchIfNecessary(data)`) |

Returns: `{ LOADED, LOADING, FAILED, fetch, fetchIfNecessary }` (object with fetch action and action type constants)

This creates two async actions (`fetch` and `fetchIfNecessary`) along with the necessary type constants that are fired in various stages of the request. Calling `fetch` will always perform the request, while `fetchIfNecessary` will prevent re-fetching if the appropriate API object is loaded.

The `storePath` must point to a valid API object path within the store.  For example, if the store has a shape like the following:

```js
{
  ...
  team: {
    users: {
      progress: "LOADING",
      data: []
    }
  }
  ...
}
```

Then the path would be `team.users`. This allows the action to avoid fetching if already `LOADING` or `LOADED`.

#### Examples

```js
import generateFetchActions from "shared/actions/helpers/generateFetchActions";
import createApiHelper from "util/universalHelpers/createApiHelper";

const generateFetchPromise = (getState, dataFromActionCall) => {
  return createApiHelper(getState()).get("/api/v1/groups");
};

export const {
  LOADING,
  LOADED,
  FAILED,
  fetchIfNecessary
} = generateFetchActions("SWIMLANE_GROUPS", "team.groups", generateFetchPromise);
```

---

### `generateWriteAction`

```js
import generateWriteAction from "shared/actions/helpers/generateWriteAction";
```

| Argument                  | Type / Description                                                                                                                     |
|:--------------------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| 1) `prefix`               | App-wide unique prefix for generated actions constants (you can reuse the same fetch prefix if you want to share the ApiObject state). |
| 2) `storePath`            | Path to API object in store (example: `team.groups`)                                                                                   |
| 3) `generateFetchPromise` | function that returns api promise. It is passed `getState` and `data` (data from the fetch call, i.e. `update(data)`)                  |

Returns: `{ STARTED, SUCCEEDED, FAILED, action }` (object with write action and action type constants)

You should rename the action and constants that you export so it's obvious what action they refer to. You can use ES2015 object pattern-matching to rename and export the entire object at the same time.

#### Examples:

```js
export const {
  STARTED: UPDATE_VIEW_STARTED,
  SUCCEEDED: UPDATE_VIEW_SUCCEEDED,
  FAILED: UPDATE_VIEW_FAILED,
  action: updateView
} = generateWriteAction("VIEWS", "user", generateUpdatePromise);
```

---

### `generateFetchReducer`

```js
import generateFetchReducer from "shared/reducers/helpers/generateFetchReducer";
```

| Argument     | Type / Description                                            |
|:-------------|:--------------------------------------------------------------|
| 1) `LOADING` | prefixed LOADING constant generated by `generateFetchActions` |
| 2) `LOADED`  | prefixed LOADED constant generated by `generateFetchActions`  |
| 3) `FAILED`  | prefixed FAILED constant generated by `generateFetchActions`  |

Returns: a reducer that handles dispatched fetch actions and builds the ApiObject state.

The ApiObject has the following shape:

```js
myApiObject: {
  progress: oneOf("INITIAL" "LOADING", "LOADED", "FAILED"),
  data: oneOf(object, array)
}
```

#### Examples

```js
import generateFetchReducer from "shared/reducers/helpers/generateFetchReducer";
import { LOADING, LOADED, FAILED } from "../actions/groupsActions";

export default generateFetchReducer(LOADING, LOADED, FAILED);
```

---

### `generateWriteReducer`

```js
import generateWriteReducer from "shared/reducers/helpers/generateWriteReducer";
```

| Argument           | Type / Description                                                      |
|:-------------------|:------------------------------------------------------------------------|
| 1) `STARTED`       | prefixed STARTED constant generated by `generateWriteAction`            |
| 2) `SUCCEEDED`     | prefixed SUCCEEDED constant generated by `generateWriteAction`          |
| 3) `FAILED`        | prefixed FAILED constant generated by `generateWriteAction`             |
| 4) callbackOptions | (advanced usage) callbacks to override the public API object attributes |

Returns: a reducer that handles dispatched actions during a write action and updates the ApiObject state.

The write ApiObject has the following shape:

```js
myApiObject: {
  // public
  data: oneOf(object, array),
  apiProgress: oneOf("INITIAL", "STARTED", "SUCCEEDED", "FAILED"),
  apiError: any,

  // internal
  backup: oneOf(object, array),
  lastRequestTimestamp: number
}
```

#### Examples

##### Basic usage

```js
import generateWriteReducer from "shared/reducers/helpers/generateWriteReducer";
import {
  UPDATE_VIEW_STARTED,
  UPDATE_VIEW_SUCCEEDED,
  UPDATE_VIEW_FAILED
} from "../actions/userActions";

export default generateWriteReducer(UPDATE_VIEW_STARTED, UPDATE_VIEW_SUCCEEDED, UPDATE_VIEW_FAILED);
```


##### Sharing ApiObject with a generated `FetchReducer`.

You will need to use `reduceReducers` to combine the two reducers into one object:


```js
import generateFetchReducer from "shared/reducers/helpers/generateFetchReducer";
import generateWriteReducer from "shared/reducers/helpers/generateWriteReducer";
import reduceReducers from "shared/reducers/helpers/reduceReducers";

import {
  LOADING,
  LOADED,
  FAILED,
  UPDATE_VIEW_STARTED,
  UPDATE_VIEW_SUCCEEDED,
  UPDATE_VIEW_FAILED
} from "../actions/userActions";


const loadingReducer = generateFetchReducer(LOADING, LOADED, FAILED);
const updatingReducer = generateWriteReducer(
  UPDATE_VIEW_STARTED,
  UPDATE_VIEW_SUCCEEDED,
  UPDATE_VIEW_FAILED
);

// Combine reducers into one object. This will extend/reduce the return state of loadingReducer and
// updatingReducer into one object.
export default reduceReducers(loadingReducer, updatingReducer);
```

##### Using the advanced callbacks to customize the response

You can provide a function to override how `data` and `apiError` are shaped. This is useful to change how responses and optimistic updates are unioned.

```js
import generateWriteReducer from "shared/reducers/helpers/generateWriteReducer";
import {
  CREATE_VIEW_STARTED,
  CREATE_VIEW_SUCCEEDED,
  CREATE_VIEW_FAILED
} from "../actions/userActions";

// Return an object with `data` and / or `apiError` keys to replace default
const onCreateViewStarted = (state, action) => {
  // Optimistic update
  // append new item (without state mutations) rather than replace entire array
  return {
    data: [...state.data, action.data];
  };
};

export default generateWriteReducer(
  CREATE_VIEW_STARTED,
  CREATE_VIEW_SUCCEEDED,
  CREATE_VIEW_FAILED,
  { onStarted: onCreateViewStarted }
);
```

---

### `generateApiContainer`

```js
import generateApiContainer from "shared/components/helpers/generateApiContainer";
```

| Argument                                                       | Type / Description                                                    |
|:---------------------------------------------------------------|:----------------------------------------------------------------------|
| 1) `className`                                                 | className for container root                                          |
| 2) `options = { requiredApiKeys = [], fetchOnServer = true } ` | Options with defaults.                                                |
| 2a) `requiredApiKeys = []`                                     | list of string keys that represent API objects from `mapStateToProps` |
| 2b) `fetchOnServer = true`                                     | Option to turn on / off server fetching for that ApiContainer.        |

Returns: a *container generator* which you will need to call again with the following objects:

| Argument            | Default              | Type / Description                                                                      |
|:--------------------|:---------------------|:----------------------------------------------------------------------------------------|
| 1) Component        | *required*           | Main feature component to wrap                                                          |
| 2) LoadingComponent | `<DefaultLoading />` | Default loading component (`defaultLoading.jsx`)                                        |
| 3) FailedComponent  | `<DefaultFailed />`  | Default failed component (`defaultFailed.jsx`). It is passed a `onRetryFetch` function. |

Returns: Wrapped ApiComponent with an optional, additional react-resolver wrapper.

#### Examples

```js
export const UsersContainer = generateApiContainer(
  "weeds-users-container-component",
  { requiredApiKeys: ["users"] }
)(Plans);
```
