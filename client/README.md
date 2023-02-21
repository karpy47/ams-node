# Client Description

## Architecture

The web client (React/Redux) exposes a web server providing web pages that make up the systems admin interface for both the company and clinicans handling patients.
The client makes calls to the servers Client API to login, fetch and update data.

The overall client (frontend) tech stack consists of:

* [Node.js](https://nodejs.org/en/) - JavaScript library
  * [React](https:/reactjs.org/) - Javascript framework
  * [Redux Toolkit](https://redux-toolkit.js.org/) - Redux developmnet toolkit
  * [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) - Data fetching and caching tool, included in Redux Toolkit
  * [TanStack Table/React Table](https://tanstack.com/table/v8) - Headless data grid tool to build tables
  * [Bootstrap](https://www.npmjs.com/package/bootstrap) - Frontend framework
  * [Yup](https://www.npmjs.com/package/yup) - JavaScript schema builder for value parsing and validation
  * [Jest](https://jestjs.io/) - Testing framework
  * ...and other packages

## Overall logic

To access anything a user must login resulting in an API-call that returns an accesstoken and refreshtoken to be used for all further API-calls. The tokens are stored in xxx/TBD to be accessible by the code.

## Some useful commands

During development it is easier to run the client locally to get access to the console and more easily trace errors.

In the project directory, you can run:

| Command | Description |
| ------- | ----------- |
| `npm start` | Runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console. |
| `npm test` | Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.|
| `npm run build` | Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed! See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information. |
| `npm update` | Updates the package file with new versions and creates/updates the lock-file as well. |

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
