const buildConfig = require('../models/configuration');
const ciApi = require('../core/ci-api');

async function load() {
    const apiResponse = await ciApi.get('/conf');
    buildConfig.update(apiResponse.data.data || apiResponse.data);
}

module.exports = {
    load,
};
