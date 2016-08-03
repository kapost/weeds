<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1911028/17382599/ef3b0866-598e-11e6-96c5-db7fe5491d52.png" width="200">
</p>

<h3 align="center">weeds</h3>

<p align="center">
  The Kapost React/Redux boilerplate
</p>

---

## What is this?

It's a universal React/Redux boilerplate to share some of the the client code we use at Kapost. You can check our blog for different articles explaining some patterns and tools within the suite. If you are curious what major tools we use, please see

It isn't a great way to learn how to use React or Redux. It might be helpful when you are trying to setup your own server-rendered app though.

<img width="601" alt="weeds" src="https://cloud.githubusercontent.com/assets/1911028/17384654/d08d956c-599a-11e6-9b21-f62b9dc428dd.png">

## Similar Projects

* [React Redux Universal Hot Example](https://github.com/erikras/react-redux-universal-hot-example)
* [Universal React + Redux Boilerplate](https://github.com/CrocoDillon/universal-react-redux-boilerplate)

A huge thank you to the maintainers of these projects for being a huge inspiration.

## Recommended Reading

Below is a recommended list of resources to get familiar with the tools and base project inspiration.

1. [React tutorial](http://facebook.github.io/react/docs/tutorial.html) (if you aren't already familiar)
1. [Dan Abramov's video introduction to redux](https://egghead.io/series/getting-started-with-redux) (should take ~30min)
1. [The redux docs](http://redux.js.org/) (Many helpful guides on testing, server rendering, middleware, etc.. This project was heavily inspired on these guides.)
1. [The react-router guides](https://github.com/reactjs/react-router/tree/master/docs)
1. [Async redux actions — why you might want to use redux-thunk](http://stackoverflow.com/a/35415559/1493191)
1. [Dan Abramov's videos on using these tools in React Applications](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)
1. [ES6 Promises](http://www.datchley.name/es6-promises/)
1. [Organizing React apps by pods](http://engineering.kapost.com/2016/01/organizing-large-react-applications/)

Also, the internal documentation.

1. [Pods](doc/pods.md)
1. [Testing](doc/testing.md)
1. [Using API utils](doc/api.md)

If there is any confusion or missing documentation [please contribute or let us know](https://github.com/kapost/weeds/issues)!

## Setup

You will want a version of node and npm that matches the package.json. If you have node installed already, installing [n](https://www.npmjs.com/package/n) will help to manage node versions.

```bash
npm install -g n
```

You should setup a way for .env to be sourced on changed directory. [`direnv`](http://direnv.net/) is an nice and safe cross-shell solution. On OSX, you can install with homebrew (`brew install direnv`).

Once the correct version of node and you have the enviroment loaded, install dependencies with:

```bash
npm install
```

To run the client app alongside an example server, run these commands in separate terminals:

```bash
npm run api:start
npm run development # or one of the other commands below.
```

and then you can navigate to `lvh.me:5000`.

Optionally, you can setup eslint and scss_lint in your editor of choice. Atom has the `linter-eslint` and `linter-scss-lint` packages which work great with the root configuration files (`.eslintrc` and `.scss-lint.yml`).

## Development

You can run the app with any of the following commands:

```
npm run development                       # run with server and webpack watching
npm run development:hot                   # run with server and webpack hot loading (updates JS without refresh)
npm run development:no-server-rendering   # same as `npm run development` but without server rendering. Useful for debugging.
npm run production                        # run app with same build configuration as production environments (heroku)
```

You should be able to navigate to `<subdomain>.localhost/canvas` with any of the above commands.


## Unit Tests

The unit test suite can be run through the following commands:

```
npm run test                    # Run all tests in suite
npm run test:debug              # Run all tests in suite with node debugger
npm run test -- -g "<App />"    # Run all tests by block (string match of `describe` or `it` blocks)
```

## Deployments

Deployments require Ruby 2.3.0 and the environment variable HEROKU_DEPLOY_API_TOKEN to be set (add the result of `heroku auth:token` to .env.local)

To promote from demo to production, use:

`rake promote`


## Test Coverage

Istanbul is used to calculate the code coverage of the repo. The total percentage is reported to CodeClimate on master builds in CircleCI. To see what code coverage is locally, run the following command:

```
npm run test:coverage
```


## Major Tools

JS apps can be particularly intimidating to get started with. It's hard to know what major dependencies are just looking at a package.json, (many dependencies are minor extensions to these major tools). Below are the list of the tools at the foundation of the app.


### App tools

| Tool                  | Notes                                                                                 |
|:----------------------|:--------------------------------------------------------------------------------------|
| [React][react]        | Facebook's user interface library                                                     |
| [React Router][rr]    | Router for client *and* server. We use the match api for server rendering.            |
| [Redux][redux]        | App state container inspired by flux.                                                 |
| [React Resolver][rre] | Container hook for server to resolve promises (used for API fetching before response) |
| [axios][ax]           | Convenient promise-based AJAX library that works universally (client and node)        |
| [lodash][ld]          | Many convenient util functions (essentially the missing Javascript standard lib)      |
| [express][ex]         | Simple, common web framework for node                                                 |

<!-- Links -->

[react]: https://facebook.github.io/react/
[rr]: https://github.com/reactjs/react-router/tree/master/docs
[rre]: https://github.com/ericclemmons/react-resolver
[redux]: http://redux.js.org/index.html
[ax]: https://github.com/mzabriskie/axios
[ld]: https://lodash.com/
[ex]: http://expressjs.com/


### Build tools

| Tool             | Notes                                                                                                                    |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------|
| [Babel][babel]   | ES2015, JSX, and object spread (stage-1) javascript is used on the client (webpack) and server / tests (babel-register). |
| [webpack][wp]    | Swiss-army knife javascript bundler. Also provides dev-server with hot-reloading.                                        |
| [gulp][gulp]     | Javascript task runner that is used as an extension of package.json scripts (compiling assets, running server, etc).     |
| [eslint][eslint] | Linter for code quality and local development help                                                                       |

<!-- Links -->

[babel]: https://github.com/babel/babel
[wp]: https://webpack.github.io/
[gulp]: http://gulpjs.com/
[eslint]: http://eslint.org/

### Test tools

See [the testing documentation](doc/testing.md#available-tools-in-suite) for testing tools.
