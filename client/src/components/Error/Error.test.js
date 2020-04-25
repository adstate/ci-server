import React from 'react';
import { render } from '@testing-library/react';
import Error from './Error';

test('renders error component', () => {
  const { getByText } = render(<Error>show error</Error>);
  expect(getByText(/show error/i)).toBeInTheDocument();
});
