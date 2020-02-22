import React from 'react';
import axios from 'axios';
import { wait, fireEvent } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { renderWithReduxRouter as customRender } from '../../utils/customRender';
import ResetPassword from './index';

const axiosMock = axios as jest.Mocked<typeof axios>;

test('reset password passes', async () => {
  const url = '/api/user/reset-password';
  axiosMock.get.mockResolvedValue({});

  const { getByTestId } = customRender(
    <Route path="/reset-password/:token">
      <ResetPassword />
    </Route>,
    {
      route: '/reset-password/124'
    }
  );

  await wait(() => expect(getByTestId(/reset-password-valid/i)));

  expect(axiosMock.get).toHaveBeenCalledTimes(1);
  expect(axiosMock.get).toHaveBeenCalledWith(url, { params: { token: '124' } });
});

test('reset password route logs out user', async () => {
  axiosMock.get.mockRejectedValue({
    response: { data: { message: 'error ' } }
  });

  const { getByTestId, store } = customRender(
    <Route path="/reset-password/:token">
      <ResetPassword />
    </Route>,
    {
      route: '/reset-password/124',
      initialState: { authState: { isAuthenticated: true } }
    }
  );

  await wait(() => expect(getByTestId(/reset-password-invalid/i)));
  expect(store.getState().authState.isAuthenticated).toEqual(false);
  expect(axiosMock.get).toHaveBeenCalledTimes(2);
});

test('reset password fails', async () => {
  const url = '/api/user/reset-password';
  axiosMock.get.mockRejectedValue({
    response: { data: { message: 'error ' } }
  });

  const { getByTestId } = customRender(
    <Route path="/confirm-email/:token">
      <ResetPassword />
    </Route>,
    {
      route: '/confirm-email/234'
    }
  );

  await wait(() => expect(getByTestId(/reset-password-invalid/i)));
  expect(axiosMock.get).toHaveBeenCalledTimes(3);
  expect(axiosMock.get).toHaveBeenCalledWith(url, { params: { token: '234' } });
});

test('reset password success displays success message', async () => {
  axiosMock.get.mockResolvedValue({});
  axiosMock.post.mockResolvedValue({
    data: { message: 'success' }
  });

  const { getByTestId, getByRole, getByPlaceholderText } = customRender(
    <Route path="/confirm-email/:token">
      <ResetPassword />
    </Route>,
    {
      route: '/confirm-email/234'
    }
  );

  await wait(() => expect(getByTestId(/reset-password-valid/i)));

  const passwordField = getByPlaceholderText('New password');
  const passwordFieldConfirm = getByPlaceholderText('Confirm password');
  const submitButton = getByRole('button');

  await wait(() => {
    fireEvent.change(passwordField, { target: { value: 'newpassword1' } });
    fireEvent.change(passwordFieldConfirm, {
      target: { value: 'newpassword1' }
    });
    fireEvent.click(submitButton);
  });

  await wait(() => expect(getByRole(/alert/i)));
});
