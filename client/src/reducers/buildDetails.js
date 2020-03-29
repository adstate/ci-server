import { 
    FETCH_BUILD_PENDING,
    FETCH_BUILD_SUCCESS,
    FETCH_BUILD_ERROR
} from '../constants/actionTypes'
 
const buildDetails = (state = {}, action) => {
    switch (action.type) {
        case FETCH_BUILD_PENDING:
            return {
                ...state,
                pending: true
            }

        case FETCH_BUILD_SUCCESS:
            return {
                ...state,
                build: action.build,
                pending: false
            }

        case FETCH_BUILD_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        default:
            return state;
    }
}
  
export default buildDetails;