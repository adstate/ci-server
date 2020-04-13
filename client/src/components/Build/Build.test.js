import React from 'react';
import { render } from '@testing-library/react';
import Build from './Build';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
    }),
}));

test('renders build component', () => {
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

  const { container } = render(<Build data={buildData}/>);
  const buildNumberElm = container.querySelector('.build__number');

  expect(buildNumberElm.textContent).toEqual(`#${buildNumber}`);
});
