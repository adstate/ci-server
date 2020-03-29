import { combineReducers } from 'redux';
import settings from './settings';
import builds from './builds';
import buildDetails from './buildDetails';

export default combineReducers({
    settings,
    builds,
    //buildDetails
});