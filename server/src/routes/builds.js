const buildRouter = require('express').Router();
const buildController = require('../controllers/builds');

buildRouter.get('/builds', buildController.getBuilds);
buildRouter.get('/builds/:buildId', buildController.getBuild);
buildRouter.get('/builds/:buildId/logs', buildController.getBuildLog);
buildRouter.post('/builds/:commitHash', buildController.addBuild);
buildRouter.post('/build/finish', buildController.buildFinish);


module.exports = buildRouter;
