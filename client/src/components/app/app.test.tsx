import React from 'react';
import axios from 'axios';
import { wait } from '@testing-library/react';
import { renderWithRedux as customRender } from '../../utils/customRender';
import App from './index';

const axiosMock = axios as jest.Mocked<typeof axios>;

test('shows home page if fetch user success', async () => {
  axiosMock.get.mockResolvedValueOnce({
    data: {
      user: {
        name: 'Mustafa',
        email: 'mustafa@gmail.com',
        password: 'foo'
      }
    }
  });

  const { getByTestId } = customRender(<App />, {
    initialState: {
      authState: {
        currentUser: null,
        isAuthenticated: false,
        loginLoading: false,
        errorMessage: ''
      }
    }
  });

  await wait(() => getByTestId('home'));
});

test('show login page if fetch user fails', async () => {
  axiosMock.get.mockRejectedValueOnce({
    response: { data: { message: 'error' } }
  });

  const { getByTestId } = customRender(<App />, {
    initialState: {
      authState: {
        currentUser: null,
        isAuthenticated: false,
        loginLoading: false,
        errorMessage: ''
      }
    }
  });

  await wait(() => getByTestId(/login/i));
});
