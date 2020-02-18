import React from 'react';
import axios from 'axios';
import { wait, fireEvent } from '@testing-library/react';
import { renderWithReduxRouter as customRender } from '../../utils/customRender';
import Register from './index';

const axiosMock = axios as jest.Mocked<typeof axios>;

test('registers user successfully', async () => {
  const url = '/api/user/register/';
  axiosMock.post.mockResolvedValue({
    data: { currentUser: null, token: null }
  });

  const { getByPlaceholderText, getByRole, store } = customRender(<Register />);
  const usernameField = getByPlaceholderText('Username');
  const emailField = getByPlaceholderText('Email');
  const passwordField = getByPlaceholderText('Password');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(usernameField, { target: { value: 'ninjanuur' } });
    fireEvent.change(emailField, { target: { value: 'ninjanuur@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  expect(axiosMock.post).toHaveBeenCalledWith(url, {
    username: 'ninjanuur',
    email: 'ninjanuur@gmail.com',
    password: 'password123'
  });

  expect(store.getState().authState.isAuthenticated).toEqual(true);
});

test('registers user fail', async () => {
  const url = '/api/user/register/';
  axiosMock.post.mockRejectedValue({
    response: { data: { message: 'error' } }
  });

  const { getByPlaceholderText, getByRole, getByTestId } = customRender(
    <Register />
  );
  const usernameField = getByPlaceholderText('Username');
  const emailField = getByPlaceholderText('Email');
  const passwordField = getByPlaceholderText('Password');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(usernameField, { target: { value: 'ninjanuur01' } });
    fireEvent.change(emailField, { target: { value: 'ninjanuur@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
  });

  expect(axiosMock.post).toHaveBeenCalledWith(url, {
    username: 'ninjanuur',
    email: 'ninjanuur@gmail.com',
    password: 'password123'
  });

  await wait(() => expect(getByTestId(/error-notification/i)));
});
