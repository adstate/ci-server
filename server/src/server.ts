import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
require('express-async-errors');

dotenv.config();

import * as config from './server-conf.json';
import notifyRouter from './routes/notify';

//services
import settingService from './services/settingService';

//utils
import init from './utils/init';

//middlewares
import errorHandler from './middlewares/error-handler';

const app: express.Application = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '15mb', extended: true }));

app.use('/', notifyRouter);

app.get('/', function (req, res) {
  res.send('ci build server');
});

app.use(errorHandler);

app.listen(config.port, async () => {
    await init();
});