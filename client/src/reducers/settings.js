import {
    SAVE_SETTINGS_PENDING,
    SAVE_SETTINGS_SUCCESS,
    SAVE_SETTINGS_ERROR,
    FETCH_SETTINGS_PENDING,
    FETCH_SETTINGS_SUCCESS,
    FETCH_SETTINGS_ERROR
} from '../constants/actionTypes'
 
const settings = (state = {}, action) => {
    switch (action.type) {
        case FETCH_SETTINGS_PENDING:
            return {
                ...state,
                pending: true
            }

        case FETCH_SETTINGS_SUCCESS:
            return Object.assign({}, state, action.settings, {pending: false});

        case FETCH_SETTINGS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        case SAVE_SETTINGS_PENDING:
            return {
                ...state,
                repoStatus: 'Empty',
                save_pending: true
            }

        case SAVE_SETTINGS_SUCCESS:
            return Object.assign({}, state, action.settings, {save_pending: false});

        case SAVE_SETTINGS_ERROR:
            return {
                ...state,
                save_pending: false,
                save_error: action.error
            }

        default:
            return state;
    }
}
  
export default settings;