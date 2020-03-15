const axios = require('axios');
const { Agent } = require('https');

const httpsAgent = new Agent({
    rejectUnauthorized: false,
});

const instance = axios.create({
    baseURL: 'https://hw.shri.yandex/api',
    timeout: 3000,
    headers: { Authorization: `Bearer ${process.env.JWT_TOKEN}` },
    httpsAgent,
});

module.exports = instance;
