import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as config from './agent-conf.json';

require('express-async-errors');
dotenv.config();

import {loadConfig} from './utils/conf';
import buildRouter from './routes/build';


//loadConfig(); 

//services

//utils
import init from './utils/init';

//middlewares
import errorHandler from './middlewares/error-handler';

const app: express.Application = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', buildRouter);

app.get('/', function (req, res) {
  res.send('ci agent server');
});

app.use(errorHandler);

app.listen(config.port, async () => {
    await init();
});