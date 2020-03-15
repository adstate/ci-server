const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    JWT_TOKEN: process.env.JWT_TOKEN,
};
