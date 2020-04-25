import React from 'react';
import { render } from '@testing-library/react';
import BuildLog from './BuildLog';


test('renders buildLog component', () => {
  const { getByText } = render(<BuildLog>test logs</BuildLog>);
  expect(getByText(/test logs/i)).toBeInTheDocument();
});
