import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { PENDING, FULFILLED, REJECTED } from '../action-types';

const LOGIN_USER = 'LOGIN_USER';
const REGISTER_USER = 'REGISTER_USER';
const FETCH_USER = 'FETCH_USER';
const LOGOUT_USER = 'LOGOUT_USER';

export interface User {
  username: string;
  email: string;
  confirmed?: boolean;
  isAdmin?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Initial state
const initialState = {
  currentUser: null as User,
  isAuthenticated: false as boolean,
  errorMessage: null as string,
  fetchLoading: true as boolean,
  loginLoading: false as boolean,
  registerLoading: false as boolean
};

export type AuthState = Readonly<typeof initialState>;

export const loginUser = (userObject: LoginRequest) => async (
  dispatch: Dispatch
): Promise<AxiosResponse> => {
  dispatch({ type: PENDING(LOGIN_USER) });
  try {
    const res = await axios.post('/api/user/login/', userObject);
    localStorage.setItem('token', res.data.token);
    dispatch({ type: FULFILLED(LOGIN_USER), payload: res.data.user });
    return res;
  } catch (err) {
    dispatch({
      type: REJECTED(LOGIN_USER),
      payload: err.response.data.message
    });
    if (err.response) {
      return err.response;
    }
    return err;
  }
};

export const registerUser = (userObject: RegisterRequest) => async (
  dispatch: Dispatch
): Promise<AxiosResponse> => {
  dispatch({ type: PENDING(REGISTER_USER) });
  try {
    const res = await axios.post('/api/user/register/', userObject);
    localStorage.setItem('token', res.data.token);
    dispatch({ type: FULFILLED(REGISTER_USER), payload: res.data.user });
    // Dispatch action to show error in UI
    return res;
  } catch (err) {
    dispatch({
      type: REJECTED(REGISTER_USER),
      payload: err.response.data.message
    });
    if (err.response) {
      return err.response;
    }
    return err;
  }
};

export const fetchUser = () => async (
  dispatch: Dispatch
): Promise<AxiosResponse> => {
  dispatch({ type: PENDING(FETCH_USER) });
  try {
    const res = await axios.get('/api/user/profile/');
    dispatch({ type: FULFILLED(FETCH_USER), payload: res.data.user });
    return res;
  } catch (err) {
    dispatch({
      type: REJECTED(FETCH_USER),
      payload: err.response.data.message
    });
    if (err.response) {
      return err.response;
    }
    return err;
  }
};

export const logoutUser = () => (dispatch: Dispatch): void => {
  dispatch({ type: LOGOUT_USER });
  localStorage.removeItem('token');
};

export const authState = (state = initialState, action): AuthState => {
  switch (action.type) {
    // Login cases
    case PENDING(LOGIN_USER):
      return { ...state, loginLoading: true };
    case FULFILLED(LOGIN_USER):
      return {
        ...state,
        currentUser: { ...action.payload },
        isAuthenticated: true,
        loginLoading: false
      };
    case REJECTED(LOGIN_USER):
      return {
        ...initialState,
        loginLoading: false,
        fetchLoading: false,
        errorMessage: action.payload
      };

    // Register cases
    case PENDING(REGISTER_USER):
      return { ...state, registerLoading: true };
    case FULFILLED(REGISTER_USER):
      return {
        ...state,
        currentUser: { ...action.payload },
        isAuthenticated: true,
        registerLoading: false
      };
    case REJECTED(REGISTER_USER):
      return {
        ...initialState,
        registerLoading: false,
        fetchLoading: false,
        errorMessage: action.payload
      };

    // Fetch cases
    case PENDING(FETCH_USER):
      return { ...state, fetchLoading: true };
    case FULFILLED(FETCH_USER):
      return {
        ...state,
        currentUser: { ...action.payload },
        isAuthenticated: true,
        fetchLoading: false
      };
    case REJECTED(FETCH_USER):
      return { ...initialState, fetchLoading: false };

    // Logout case
    case LOGOUT_USER:
      return { ...initialState, fetchLoading: false };
    default:
      return { ...state };
  }
};
