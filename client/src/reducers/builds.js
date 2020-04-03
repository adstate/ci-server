import {
    FETCH_BUILD_PENDING,
    FETCH_BUILD_SUCCESS,
    FETCH_BUILD_ERROR,
    FETCH_BUILD_LOG_SUCCESS,
    FETCH_BUILD_LOG_ERROR,
    FETCH_BUILDS_PENDING,
    FETCH_BUILDS_SUCCESS,
    FETCH_BUILDS_ERROR,
    ADD_BUILD_PENDING,
    ADD_BUILD_SUCCESS,
    ADD_BUILD_ERROR,
    BUILDS_UPDATE_OFFSET,
    BUILDS_CLEAR_STATE,
    ADD_BUILD_TO_VIEW,
    CLEAR_BUILD_TO_VIEW
} from 'actions/actionTypes'
 
const builds = (state = {}, action) => {
    switch (action.type) {
        case FETCH_BUILDS_PENDING:
            return {
                ...state,
                pending: true
            }

        case FETCH_BUILDS_SUCCESS:
            const totalFetch = action.builds.length;

            return {
                ...state,
                items: [...state.items, ...action.builds],
                pending: false,
                init_loaded: true,
                load_more: totalFetch === 0
            }

        case FETCH_BUILDS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        case FETCH_BUILD_PENDING:
            return {
                ...state,
                get_build_pending: true
            }
        
        case FETCH_BUILD_SUCCESS:
            return {
                ...state,
                items: [...state.items, action.build],
                //build_to_view: action.build,
                get_build_pending: false
            }
        
        case FETCH_BUILD_ERROR:
            return {
                ...state,
                get_build_pending: false,
                error: action.error
            }

        case ADD_BUILD_PENDING:
            return {
                ...state,
                add_build_pending: true
            }

        case ADD_BUILD_SUCCESS:
            return {
                ...state,
                items: [action.build, ...state.items],
                offset: state.offset + 1,
                add_build_pending: false
            }

        case ADD_BUILD_ERROR:
            return {
                ...state,
                add_build_pending: false
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

        case ADD_BUILD_TO_VIEW:
            return {
                ...state,
                build_to_view: action.build
            }

        case CLEAR_BUILD_TO_VIEW: 
            return {
                ...state,
                build_to_view: null,
                build_log_to_view: null
            }

        case FETCH_BUILD_LOG_SUCCESS:
            return {
                ...state,
                build_log_to_view: action.log
            }
        
        case FETCH_BUILD_LOG_ERROR:
            return {
                ...state,
                get_log_error: action.error
            }

        default:
            return state;
    }
}
  
export default builds;