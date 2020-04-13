import React from 'react';
import { render } from '@testing-library/react';
import Configure from './Configure';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

test('renders configure component', () => {
  const { container } = render(<Configure/>);
  const confIcon = container.querySelector('.configure__icon');
  expect(confIcon).toBeInTheDocument();
});
