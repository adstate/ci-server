import {Router} from 'express';
import buildController from '../controllers/builds';

const buildRouter: Router = Router();

buildRouter.get('/builds', buildController.getBuilds);
buildRouter.get('/builds/:buildId', buildController.getBuild);
buildRouter.get('/builds/:buildId/logs', buildController.getBuildLog);
buildRouter.post('/builds/:commitHash', buildController.addBuild);


export default buildRouter;
