import dotenv from 'dotenv';

dotenv.config();

export default {
    JWT_TOKEN: process.env.JWT_TOKEN,
    CACHE_LIFESPAN: 20 * 60 * 1000,
};
