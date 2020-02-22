import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithReduxRouter as customRender } from '../../utils/customRender';
import Nav from './index';

test('renders navbar', async () => {
  const { getByTestId, getByRole, store } = customRender(<Nav />);
  expect(getByTestId(/primary-nav/i));

  const logoutButton = getByRole('button');
  fireEvent.click(logoutButton);

  expect(store.getState().authState.isAuthenticated).toEqual(false);
});
