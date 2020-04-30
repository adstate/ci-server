import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';

require('express-async-errors');
require('./config');
require('./core/buildConf');
require('./core/git-service');
require('./core/log-cache');

import conf from './utils/conf';

import errorHandler from './middlewares/error-handler';
import settingRouter from './routes/settings';
import buildRouter from './routes/builds';


const app: express.Application = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function (req, res) {
    res.send('ci webserver');
});

app.use('/api', settingRouter);
app.use('/api', buildRouter);

app.use(errorHandler);

app.listen(9000, async () => {
    try {
        await conf.load();
    } catch (e) {
        console.error('ERROR:Configuration is not loaded.', e.message);
    }
});
