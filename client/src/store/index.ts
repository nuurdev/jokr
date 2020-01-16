import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import rootReducer, { RootState } from '../reducers';

const initStore = (initState?: RootState, middlewares?: Middleware[]): Store =>
  createStore(rootReducer, initState || {}, applyMiddleware(...middlewares));

export default initStore;
