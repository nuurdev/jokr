import React from 'react';
import { renderWithRouter as customRender } from '../../utils/customRender';
import NotFound from './index';

it('renders without crashing', () => {
  const { getByTestId } = customRender(<NotFound />);
  expect(getByTestId(/not-found/i));
});
