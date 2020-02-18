import React from 'react';
import axios from 'axios';
import { wait, fireEvent } from '@testing-library/react';
import { renderWithReduxRouter as customRender } from '../../utils/customRender';
import Login from './index';

const axiosMock = axios as jest.Mocked<typeof axios>;

test('login user successfully', async () => {
  const url = '/api/user/login/';
  axiosMock.post.mockResolvedValue({
    data: { currentUser: null, token: null }
  });

  const { getByPlaceholderText, getByRole, store } = customRender(<Login />);
  const usernameField = getByPlaceholderText('Username');
  const passwordField = getByPlaceholderText('Password');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(usernameField, { target: { value: 'ninjanuur' } });
    fireEvent.change(passwordField, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  expect(axiosMock.post).toHaveBeenCalledWith(url, {
    username: 'ninjanuur',
    password: 'password123'
  });

  expect(store.getState().authState.isAuthenticated).toEqual(true);
});

test('login user fail', async () => {
  const url = '/api/user/login/';
  axiosMock.post.mockRejectedValue({
    response: { data: { message: 'error ' } }
  });

  const { getByPlaceholderText, getByRole, getByTestId } = customRender(
    <Login />
  );
  const usernameField = getByPlaceholderText('Username');
  const passwordField = getByPlaceholderText('Password');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(usernameField, { target: { value: 'ninjanuur' } });
    fireEvent.change(passwordField, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  expect(axiosMock.post).toHaveBeenCalledWith(url, {
    username: 'ninjanuur',
    password: 'password123'
  });

  await wait(() => expect(getByTestId(/error-notification/i)));
});
