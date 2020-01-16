/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import axios from 'axios';
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

export const loginUser = (userObject: LoginRequest) => dispatch =>
  dispatch({
    type: LOGIN_USER,
    payload: axios.post('/api/user/login/', userObject)
  })
    .then(res => {
      const { token, user } = res.value.data;
      const { username } = user;
      localStorage.setItem('token', token);
      console.log(username);
      // Show notification in UI
    })
    .catch(error => {
      console.log(error);
      // Show error in the UI
    });

export const registerUser = (userObject: RegisterRequest) => dispatch =>
  dispatch({
    type: REGISTER_USER,
    payload: axios.post('/api/user/register/', userObject)
  })
    .then(res => {
      const { token, user } = res.value.data;
      const { username } = user;
      localStorage.setItem('token', token);
      console.log(username);
      // Show notification in UI
    })
    .catch(error => {
      console.log(error);
      // Show error in the UI
    });

export const fetchUser = () => dispatch =>
  dispatch({
    type: FETCH_USER,
    payload: axios.get('/api/user/profile/')
  })
    .then(res => console.log(res))
    .catch(err => console.log(err));

export const logoutUser = () => dispatch => {
  dispatch({
    type: LOGOUT_USER
  });
  localStorage.removeItem('token');
};

export const authState = (state = initialState, action) => {
  switch (action.type) {
    // Login cases
    case PENDING(LOGIN_USER):
      return { ...state, loginLoading: true };
    case FULFILLED(LOGIN_USER):
      return {
        ...state,
        currentUser: { ...action.payload.data.user },
        isAuthenticated: true,
        loginLoading: false
      };
    case REJECTED(LOGIN_USER):
      return {
        ...initialState,
        loginLoading: false,
        fetchLoading: false,
        errorMessage: action.payload.response.data.message
      };

    // Register cases
    case PENDING(REGISTER_USER):
      return { ...state, registerLoading: true };
    case FULFILLED(REGISTER_USER):
      return {
        ...state,
        currentUser: { ...action.payload.data.user },
        isAuthenticated: true,
        registerLoading: false
      };
    case REJECTED(REGISTER_USER):
      return {
        ...initialState,
        registerLoading: false,
        fetchLoading: false,
        errorMessage: action.payload.response.data.message
      };

    // Fetch cases
    case PENDING(FETCH_USER):
      return { ...state, fetchLoading: true };
    case FULFILLED(FETCH_USER):
      return {
        ...state,
        currentUser: { ...action.payload.data.user },
        isAuthenticated: true,
        fetchLoading: false
      };
    case REJECTED(FETCH_USER):
      return { ...initialState, fetchLoading: false };

    // Logout case
    case LOGOUT_USER:
      return { ...initialState };
    default:
      return { ...state };
  }
};
