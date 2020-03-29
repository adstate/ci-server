import { 
    SAVE_SETTINGS_SUCCESS,
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

        case SAVE_SETTINGS_SUCCESS:
            return Object.assign({}, state, action.settings, {pending: false});

        default:
            return state;
    }
}
  
export default settings;