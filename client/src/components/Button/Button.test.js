import React from 'react';
import { render } from '@testing-library/react';
import Button from './Button';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

test('renders button component', () => {
  const { getByText } = render(<Button size="s">Save</Button>);
  expect(getByText(/Save/i)).toBeInTheDocument();
});
