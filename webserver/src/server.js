const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const history = require('connect-history-api-fallback');

require('express-async-errors');
require('./config');
require('./core/buildConf');
require('./core/git-service');
require('./core/log-cache');

const conf = require('./utils/conf');

const errorHandler = require('./middlewares/error-handler');
const settingRouter = require('./routes/settings');
const buildRouter = require('./routes/builds');


const app = express();

app.use(helmet());
app.use(cors());
app.use(history());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/api', settingRouter);
app.use('/api', buildRouter);

app.use(errorHandler);

app.listen(8080, async () => {
    try {
        await conf.load();
    } catch (e) {
        console.error('ERROR:Configuration is not loaded.', e.message);
    }
});
