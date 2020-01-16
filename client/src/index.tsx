import './styles/global.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import * as serviceWorker from './serviceWorker';
import initStore from './store';
import App from './containers/app/App';

// could move this somewhere else
axios.interceptors.request.use(
  config => {
    // eslint-disable-next-line no-param-reassign
    config.headers = { 'auth-token': localStorage.getItem('token') };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const loggerMiddleware = createLogger({ collapsed: true });

const store = initStore(null, [
  thunkMiddleware,
  promiseMiddleware,
  loggerMiddleware
]);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
