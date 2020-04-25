import React from 'react';
import { render } from '@testing-library/react';
import Icon from './Icon';


test('renders icon component', () => {
  const { container } = render(<Icon type="person" size="s"></Icon>);
  const icon = container.querySelector('.icon_type_person');
  expect(icon).toBeInTheDocument();
});
