import React from 'react';
import { render } from '@testing-library/react';
import FormField from './FormField';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

test('renders formField component', () => {
  const inputValue = 'test';
  const { container } = render(<FormField type="text" defaultValue={inputValue} cleared/>);
  const input = container.querySelector('.form-field__input');

  expect(input.value).toEqual(inputValue);
});
