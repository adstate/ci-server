import { 
    FETCH_BUILDS_PENDING,
    FETCH_BUILDS_SUCCESS,
    FETCH_BUILD_SUCCESS,
    FETCH_BUILDS_ERROR,
    BUILDS_UPDATE_OFFSET,
    BUILDS_CLEAR_STATE
} from '../constants/actionTypes'
 
const builds = (state = {}, action) => {
    switch (action.type) {
        case FETCH_BUILDS_PENDING:
            return {
                ...state,
                pending: true
            }

        case FETCH_BUILDS_SUCCESS:
            return {
                ...state,
                items: [...state.items, ...action.builds],
                pending: false
            }
        
        case FETCH_BUILD_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.build],
                pending: false
            }

        case FETCH_BUILDS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        case BUILDS_UPDATE_OFFSET: 
            return {
                ...state,
                offset: action.offset
            }

        case BUILDS_CLEAR_STATE:
            return {
                ...state,
                items: []
            }

        default:
            return state;
    }
}
  
export default builds;