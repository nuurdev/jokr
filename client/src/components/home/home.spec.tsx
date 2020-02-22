import React from 'react';
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
  const { getByTestId } = customRender(<Home {...props} />);
  expect(getByTestId('home'));
});
