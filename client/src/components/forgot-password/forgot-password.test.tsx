import React from 'react';
import axios from 'axios';
import { wait, fireEvent } from '@testing-library/react';
import { renderWithReduxRouter as customRender } from '../../utils/customRender';
import ForgotPassword from './index';

const axiosMock = axios as jest.Mocked<typeof axios>;

test('forgot password request works', async () => {
  const url = '/api/user/forgot-password/';
  axiosMock.post.mockResolvedValue({
    data: { message: 'success' }
  });

  const { getByPlaceholderText, getByRole } = customRender(<ForgotPassword />);

  const emailField = getByPlaceholderText('Email');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(emailField, { target: { value: 'ninjanuur@gmail.com' } });
    fireEvent.click(submitButton);
  });

  expect(axiosMock.post).toHaveBeenCalledWith(url, {
    email: 'ninjanuur@gmail.com'
  });
});

test('forgot password route logs out user', async () => {
  axiosMock.post.mockRejectedValue({
    response: { data: { message: 'error' } }
  });

  const { getByPlaceholderText, getByRole, store } = customRender(
    <ForgotPassword />,
    {
      initialState: { authState: { isAuthenticated: true } }
    }
  );

  const emailField = getByPlaceholderText('Email');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(emailField, { target: { value: 'ninjanuur@gmail.com' } });
    fireEvent.click(submitButton);
  });

  expect(store.getState().authState.isAuthenticated).toEqual(false);
});
