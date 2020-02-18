import React from 'react';
import axios from 'axios';
import { wait } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { renderWithRouter as customRender } from '../../utils/customRender';
import ConfirmEmail from './index';

const axiosMock = axios as jest.Mocked<typeof axios>;

test('confirm email passes', async () => {
  const url = '/api/user/confirm-email/';
  axiosMock.post.mockResolvedValue({});

  const { getByTestId } = customRender(
    <Route path="/confirm-email/:token">
      <ConfirmEmail />
    </Route>,
    {
      route: '/confirm-email/123'
    }
  );

  await wait(() => expect(getByTestId(/email-confirm-valid/i)));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(axiosMock.post).toHaveBeenCalledWith(url, { token: '123' });
});

test('confirm email fails', async () => {
  const url = '/api/user/confirm-email/';
  axiosMock.post.mockRejectedValue({});

  const { getByTestId } = customRender(
    <Route path="/confirm-email/:token">
      <ConfirmEmail />
    </Route>,
    {
      route: '/confirm-email/234'
    }
  );

  await wait(() => expect(getByTestId(/email-confirm-invalid/i)));
  expect(axiosMock.post).toHaveBeenCalledTimes(2);
  expect(axiosMock.post).toHaveBeenCalledWith(url, { token: '234' });
});
