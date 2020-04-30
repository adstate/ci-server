import {Router} from 'express';
import settingController from '../controllers/settings';

const settingRouter: Router = Router();

settingRouter.post('/settings', settingController.saveSettings);
settingRouter.get('/settings', settingController.getSettings);


export default settingRouter;
