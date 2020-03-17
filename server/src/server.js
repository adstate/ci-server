const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const express = require('express');
require('express-async-errors');

const config = require('./config');

const errorHandler = require('./middlewares/error-handler');
const checkRepoStateHandler = require('./middlewares/check-repo-state');
const settingRouter = require('./routes/settings');
const buildRouter = require('./routes/builds');


const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', checkRepoStateHandler);

app.use('/api', settingRouter);
app.use('/api', buildRouter);

app.use(errorHandler);

app.listen(3000);