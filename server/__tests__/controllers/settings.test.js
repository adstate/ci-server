const settingController = require("../../src/controllers/settings");
const MockAdapter = require('axios-mock-adapter');
const ciApi = require('../../src/core/ci-api').instance;
const mockResponse = require('../mocks/response');
const mockRequest = require('../mocks/request');

const gitService = require('../../src/core/git-service');
const buildConfig = require('../mocks/buildConfig');

jest.mock('../../src/core/git-service');


describe('Test settings api methods', () => {
    test('getSettings: should return settings', async () => {
      const ciApiMock = new MockAdapter(ciApi);

      const result = {
        "status": "success",
        "data": {
            "id": "123",
            "repoName": "test"
        }
      }

      ciApiMock.onGet('/conf')
               .reply(200, result);

      const req = mockRequest();
      const res = mockResponse();

      await settingController.getSettings(req, res);

      result.data.repoStatus = buildConfig.repoStatus;

      expect(res.json).toHaveBeenCalledWith(result);
    });

    test('saveSettings: should save settings with new repoName', async () => {
        buildConfig.update({
            reposName: "test"
        });

        const ciApiMock = new MockAdapter(ciApi);
        const commit = {
            hash: '123',
            author: 'GitHub',
            message: 'test'
          }
        
        gitService.clean.mockResolvedValue({});
        gitService.getLastCommit.mockResolvedValue(commit);
        gitService.clone.mockResolvedValue({});

        const settings = {
            "repoName": "adstate/ci-server",
            "buildCommand": "npm run build",
            "mainBranch": "master",
            "period": 10
        }

        const result = {
            "status": "success",
            "repoStatus": "Cloning"
        }

        ciApiMock.onPost('/conf')
                 .reply(200, {});

        ciApiMock.onDelete('/conf')
                 .reply(200, {});

        ciApiMock.onPost('/build/request')
                 .reply(200, {});


        const req = mockRequest(settings);
        const res = mockResponse();

        await settingController.saveSettings(req, res);

        expect(res.json).toHaveBeenCalledWith(result);
    });

    test('saveSettings: should save settings with new branchName', async () => {
        buildConfig.update({
            reposName: "adstate/ci-server",
            mainBranch: "master"
        });

        const ciApiMock = new MockAdapter(ciApi);
        const commit = {
            hash: '123',
            author: 'GitHub',
            message: 'test'
          }
        
        gitService.clean.mockResolvedValue({});
        gitService.getLastCommit.mockResolvedValue(commit);

        gitService.clone.mockResolvedValue({});
        gitService.pull.mockResolvedValue({});

        const settings = {
            "repoName": "adstate/ci-server",
            "buildCommand": "npm run build",
            "mainBranch": "react",
            "period": 10
        }

        const result = {
            "status": "success",
            "repoStatus": "Cloned"
        }

        ciApiMock.onPost('/conf')
                 .reply(200, {});

        ciApiMock.onDelete('/conf')
                 .reply(200, {});

        ciApiMock.onPost('/build/request')
                 .reply(200, {});


        const req = mockRequest(settings);
        const res = mockResponse();

        await settingController.saveSettings(req, res);

        expect(res.json).toHaveBeenCalledWith(result);
    });

});