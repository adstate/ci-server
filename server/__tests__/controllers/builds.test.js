const buildController = require("../../src/controllers/builds");
const MockAdapter = require('axios-mock-adapter');
const ciApi = require('../../src/core/ci-api').instance;
const { PassThrough } = require('stream');
const mockResponse = require('../mocks/response');
const mockRequest = require('../mocks/request');

const gitService = require('../../src/core/git-service');
const buildConfig = require('../../src/core/buildConf');


describe('Test builds api methods', () => {
    test('getBuilds: should return list of builds', async () => {
      const ciApiMock = new MockAdapter(ciApi);

      const result = {
        "status": "success",
        "data": [
            {
              "id": "123",
              "status": "Waiting"
            }
        ]
      }

      ciApiMock.onGet('/build/list').reply(200, result);

      const req = mockRequest();
      const res = mockResponse();

      await buildController.getBuilds(req, res);

      expect(res.json).toHaveBeenCalledWith(result);
    });

    test('getBuild: should return build', async () => {
      const ciApiMock = new MockAdapter(ciApi);
      const result = {
        "status": "success",
        "data": {
            "id": "123",
            "status": "Waiting"
        }
      }

      ciApiMock.onGet('/build/details')
          .reply(200, result);

      const req = mockRequest({}, {buildId: '123'});
      const res = mockResponse();

      await buildController.getBuild(req, res);

      expect(res.json).toHaveBeenCalledWith(result);
    });

    test('getBuildLog: should return build log', async () => {
      const ciApiMock = new MockAdapter(ciApi);
      const result = 'test logs...';
      const mockedStream = new PassThrough();

      ciApiMock.onGet('/build/log')
               .reply(200, mockedStream);

      const req = mockRequest({}, {}, {buildId: '123'});
      const res = mockResponse();

      res.write = jest.fn().mockReturnValue(res);
      res.end = jest.fn().mockReturnValue(res);
    
      await buildController.getBuildLog(req, res);

      mockedStream.emit('data', result);
      mockedStream.end();

      mockedStream.on('end', () => {
        expect(res.write).toHaveBeenCalledWith(result);
      });
    });

    test('addBuild: should add build to storage', async () => {
      const ciApiMock = new MockAdapter(ciApi);
      const commit = {
        hash: '123',
        author: 'GitHub',
        message: 'test'
      }

      gitService.getCommitInfo = jest.fn(() => commit);
      buildConfig.mainBranch = 'master';

      const buildData = {
        "status": "success",
        "data": {
          "id": "111",
          "buildNumber": 1,
          "status": "Waiting"
        }
      }

      const result = {
        "status": "success",
        "data": {
          "id": buildData.data.id,
          "buildNumber": buildData.data.buildNumber,
          "status": buildData.data.status,
          "authorName": commit.author,
          "commitHash": commit.hash,
          "commitMessage": commit.message,
          "branchName": buildConfig.mainBranch
        }
      }

      const req = mockRequest({}, {}, {commitHash: '123'});
      const res = mockResponse();
  
      ciApiMock.onPost(`/build/request`)
               .reply(200, buildData);

      await buildController.addBuild(req, res);

      expect(res.json).toHaveBeenCalledWith(result);
    });
});