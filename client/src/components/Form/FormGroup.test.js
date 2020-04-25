import React from 'react';
import { render } from '@testing-library/react';
import FormGroup from './FormGroup';

test('renders formField component', () => {
  const { container } = render(
    <FormGroup>
        <input type="text" className="test-input" defaultValue="test"></input>
    </FormGroup>
  );

  const input = container.querySelector('.test-input');
  expect(input.value).toEqual('test');
});
