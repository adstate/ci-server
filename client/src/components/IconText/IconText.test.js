import React from 'react';
import { render } from '@testing-library/react';
import IconText from './IconText';


test('renders iconText component', () => {
  const { container } = render(<IconText icon="person">icon text</IconText>);
  const icon = container.querySelector('.icon_type_person');
  expect(icon).toBeInTheDocument();
});
