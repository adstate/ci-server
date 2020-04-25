import React from 'react';
import { createStore } from 'redux';
import SettingForm from './SettingForm';
import { render, fireEvent, screen } from '../../../__tests__/test-utils';
import reducer from '../../reducers';

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

describe('settingForm', () => {
    test('renders loader before form is loaded', () => {
        const store = createStore(reducer, { settings: {pending: true} });
      
        const { container } = render(
          <SettingForm/>, {
              store
          }
        );
        
        const loader = container.querySelector('.loader');
        expect(loader).toBeInTheDocument();
    });

    test('renders settingForm component', () => {
        const store = createStore(reducer, { settings: {pending: false} });
      
        const { container } = render(
          <SettingForm/>, {
              store
          }
        );
        
        const form = container.querySelector('.setting-form');
        expect(form).toBeInTheDocument();
    });
});
