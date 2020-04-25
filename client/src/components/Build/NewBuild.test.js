import React from 'react';
import { render } from '@testing-library/react';
import NewBuild from './NewBuild';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

jest.spyOn(React, 'useEffect').mockImplementation(f => f());

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
};

test('renders build component', () => {
  const { container } = render(<NewBuild open/>);
  const newBuild = container.querySelector('.new-build__title');

  expect(newBuild.textContent).toEqual('New build');
});
