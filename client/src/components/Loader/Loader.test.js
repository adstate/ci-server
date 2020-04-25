import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';


test('renders loader component', () => {
  const { container } = render(<Loader></Loader>);
  expect(container.querySelector('.loader')).toBeInTheDocument();
});
