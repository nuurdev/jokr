import React from 'react';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import initStore from '../store';

export const renderWithRedux = (
  ui,
  {
    initialState = null,
    store = initStore(initialState, [thunkMiddleware, promiseMiddleware])
  } = {}
) => ({
  ...render(<Provider store={store}>{ui}</Provider>),
  store
});

export const renderWithRouter = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) => ({
  ...render(<Router history={history}>{ui}</Router>),
  history
});

export const renderWithReduxRouter = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    initialState = null,
    store = initStore(initialState, [thunkMiddleware, promiseMiddleware])
  } = {}
) => ({
  ...render(
    <Provider store={store}>
      <Router history={history}>{ui}</Router>
    </Provider>
  ),
  store,
  history
});
