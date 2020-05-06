import { combineReducers } from 'redux';
import settings from './settings';
import builds from './builds';

const rootReducer = combineReducers({
    settings,
    builds,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
