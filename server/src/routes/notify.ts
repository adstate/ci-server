import * as controller from '../controllers/notify';
import {Router} from 'express';

const notifyRouter: Router = Router();

notifyRouter.post('/notify-agent', controller.notifyAgent);
notifyRouter.post('/notify-build-result', controller.notifyAgent);

export default notifyRouter;
