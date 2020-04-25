const { PassThrough } = require('stream');

const MockProcess = () => {
    const process = new PassThrough();
    process.stderr = new PassThrough();
    process.stdout = new PassThrough();

    return process;
}

module.exports = MockProcess;