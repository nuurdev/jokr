import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithReduxRouter as customRender } from '../../utils/customRender';
import Home from './index';

const props = {
  currentUser: {
    isAuthenticated: true,
    username: 'nuurspace',
    email: 'nuurspace@gmail.com'
  }
};

test('logs out user successfully', async () => {
  const { getByRole, store } = customRender(<Home {...props} />);

  const logoutButton = getByRole('button');
  fireEvent.click(logoutButton);

  expect(store.getState().authState.isAuthenticated).toEqual(false);
});
