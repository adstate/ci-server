const ciApi = require('../core/ci-api');
const ServerError = require('../errors/server-error');

async function saveSettings(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.post('/conf', req.body);
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
    });
}

async function getSettings(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.get('/conf');
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
        data: apiResponse.data.data,
    });
}

async function deleteSettings(req, res) {
    let apiResponse;

    try {
        apiResponse = await ciApi.delete('/conf');
    } catch (e) {
        throw new ServerError(500);
    }

    return res.json({
        status: 'success',
    });
}

module.exports = {
    saveSettings,
    getSettings,
    deleteSettings,
};
