import React from 'react';
import { render } from '@testing-library/react';
import FormError from './FormError';

test('renders formField component', () => {
  const errorText = 'test error';
  const { getByText } = render(<FormError>{errorText}</FormError>);

  expect(getByText(errorText)).toBeInTheDocument();
});
