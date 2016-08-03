# Creating new features

All features in the boilerplate [should live in a pod](http://engineering.kapost.com/2016/01/organizing-large-react-applications/). Most features need a Container component that connects to the redux store and optionally wraps with API functionality.

New pods (with store data) should have this initial structure:

```
myFeature/
  actions/
    myFeatureActions1.js
    myFeatureActions2.js
  components/
    myFeature.jsx
    otherComponent.jsx
  reducers/
    myFeatureReducer1.js
    myFeatureReducer2.js
    index.js              // Roll up reducers for pod so app only has to pull in one entry file
  styles/
    _someStyles1.scss
    _someStyles2.scss
    _index.scss           // Roll up other scss files so app only has to pull in one entry file
  myFeatureContainer.jsx
```

Note that this structure favors composition / rolling up. Containers serve as the entry point for components (and actions), styles/index serves as the entry point to styles, and reducers/index serve as the entry point to the main store reducer. There are many great examples in the repo, please maintain that structure and any other patterns within pods.
