import { combineReducers } from 'redux';
import { authState, AuthState } from './auth';

export interface RootState {
  readonly authState: AuthState;
}

const rootReducer = combineReducers<RootState>({
  authState
});

export default rootReducer;
