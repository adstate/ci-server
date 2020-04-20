import * as controller from '../controllers/build';
import {Router} from 'express';

const notifyRouter: Router = Router();

notifyRouter.post('/build', controller.build);

export default notifyRouter;
