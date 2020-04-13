import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

test('renders footer component', () => {
  const { getByText } = render(<Header title="ci-server"></Header>);
  const title = getByText(/ci-server/i)
  expect(title).toBeInTheDocument();
});
