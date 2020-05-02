const settingRouter = require('express').Router();
const settingController = require('../controllers/settings');

settingRouter.post('/settings', settingController.saveSettings);
settingRouter.get('/settings', settingController.getSettings);


module.exports = settingRouter;
