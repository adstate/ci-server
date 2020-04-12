const { spawn } = require('child_process');
const { PassThrough } = require('stream');
const GitUtils = require('../../src/utils/git-utils');
const MockProcess = require('../mocks/childProcess');

describe('test git-utils', () => {
    test('should clone repository', async () => {
        const process = MockProcess();
        const spawnMock = jest.fn().mockReturnValue(process);
        
        const gitUtils = new GitUtils();
        gitUtils.spawn = spawnMock;

        const spy = jest.fn();
        const clone = gitUtils.clone('http://github.com/adstate/ci-server', '/var/repo/test').then((res) => {
            spy(res);
        });

        process.stderr.emit('data', 'cloning repository');
        process.emit('close', 0);

        await clone;

        expect(spy).toHaveBeenCalledWith({message: 'success'});
    });

    test('should make git pull', async () => {
        const process = MockProcess();
        const spawnMock = jest.fn().mockReturnValue(process);
        
        const gitUtils = new GitUtils();
        gitUtils.spawn = spawnMock;

        const spy = jest.fn();
        const pull = gitUtils.pull('/var/repo/test').then((res) => {
            spy(res);
        });

        process.stderr.emit('data', 'git pull');
        process.emit('close', 0);

        await pull;

        expect(spy).toHaveBeenCalledWith({message: 'success'});
    });

    test('should make git checkout', async () => {
        const process = MockProcess();
        const spawnMock = jest.fn().mockReturnValue(process);
        
        const gitUtils = new GitUtils();
        gitUtils.spawn = spawnMock;

        const spy = jest.fn();
        const checkout = gitUtils.checkout('test', '/var/repo/test').then((res) => {
            spy(res);
        });

        process.stderr.emit('data', 'git checkout');
        process.emit('close', 0);

        await checkout;

        expect(spy).toHaveBeenCalledWith({message: 'success'});
    });

    test('should get last commit', async () => {
        const process = MockProcess();
        const spawnMock = jest.fn().mockReturnValue(process);
        
        const gitUtils = new GitUtils();
        gitUtils.spawn = spawnMock;

        const result = {
            "author": "Felix.Khodakovskiy",
            "hash": "392e499",
            "message": "add server controller tests"
        }

        const spy = jest.fn();
        const getLastCommit = gitUtils.getLastCommit('/var/repo/test').then((res) => {
            spy(res);
        });

        process.stdout.emit('data', '392e499;Felix.Khodakovskiy;add server controller tests');
        process.emit('close', 0);

        await getLastCommit;

        expect(spy).toHaveBeenCalledWith(result);
    });

    test('should get commit info', async () => {
        const process = MockProcess();
        const spawnMock = jest.fn().mockReturnValue(process);
        
        const gitUtils = new GitUtils();
        gitUtils.spawn = spawnMock;

        const result = {
            "author": "Felix.Khodakovskiy",
            "hash": "392e499",
            "message": "add server controller tests"
        }

        const spy = jest.fn();
        const getCommitInfo = gitUtils.getCommitInfo('392e499', '/var/repo/test').then((res) => {
            spy(res);
        });

        process.stdout.emit('data', '392e499;Felix.Khodakovskiy;add server controller tests');
        process.emit('close', 0);

        await getCommitInfo;

        expect(spy).toHaveBeenCalledWith(result);
    });

    test('should parse commit log string', async () => {
        const process = MockProcess();
        const spawnMock = jest.fn().mockReturnValue(process);
        
        const gitUtils = new GitUtils();
        gitUtils.spawn = spawnMock;

        const result = {
            "author": "Felix.Khodakovskiy",
            "hash": "392e499",
            "message": "add server controller tests"
        }

        const commitStr = '392e499;Felix.Khodakovskiy;add server controller tests';
        const commit = gitUtils.parseCommitInfo(commitStr);

        expect(commit).toEqual(result);
    });
});