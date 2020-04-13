import React from 'react';
import { createStore } from 'redux';
import BuildList from './BuildList';
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

describe('buildList', () => {
    test('renders loader before builds is loaded', () => {
        const store = createStore(reducer, {
            builds: {
                items: [],
                offset: 0,
                limit: 10,
                pending: true,
                init_loaded: true
            }
        });
      
        const { container, unmount } = render(
          <BuildList/>, {
              store
          }
        );
        
        const loader = container.querySelector('.loader');
        expect(loader).toBeInTheDocument();

        unmount();
    });

    test('renders buildList component', () => {
        const buildNumber = 21;
        const buildData = {
            id: "d066a8a8-89a7-413b-bdb4-f568e48355a0",
            configurationId: "3d085322-68e9-4927-a135-ddff5df06a32",
            buildNumber: buildNumber,
            commitMessage: "Merge pull request #3 from adstate/react",
            commitHash: "afb2739",
            branchName: "master",
            authorName: "GitHub",
            status: "Waiting"
      }

        const store = createStore(reducer, {
            builds: {
                items: [buildData],
                offset: 0,
                limit: 10,
                pending: false,
                init_loaded: true
            }
        });
      
        const { container, unmount } = render(
          <BuildList/>, {
              store
          }
        );
        
        const buildNumberElm = container.querySelector('.build__number');
        expect(buildNumberElm.textContent).toEqual(`#${buildNumber}`);

        unmount();
    });
});
