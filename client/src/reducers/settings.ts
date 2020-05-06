import {
    SAVE_SETTINGS_PENDING,
    SAVE_SETTINGS_SUCCESS,
    SAVE_SETTINGS_ERROR,
    FETCH_SETTINGS_PENDING,
    FETCH_SETTINGS_SUCCESS,
    FETCH_SETTINGS_ERROR,
    SettingsActionTypes
} from 'actions/actionTypes';
import RepoStatus from 'models/repoStatus';

export interface SettingsState {
    id: string;
    repoName: string;
    mainBranch: string;
    buildCommand: string;
    period: number;
    pending?: boolean;
    error?: Error;
    save_pending?: boolean;
    save_error?: Error;
    repoStatus: RepoStatus
}

const initialState: SettingsState = {
    id: '',
    repoName: '',
    mainBranch: '',
    buildCommand: '',
    period: 0,
    repoStatus: RepoStatus.Empty
}
 
const settings = (state: SettingsState = initialState, action: SettingsActionTypes): SettingsState => {
    switch (action.type) {
        case FETCH_SETTINGS_PENDING:
            return {
                ...state,
                pending: true
            }

        case FETCH_SETTINGS_SUCCESS:
            return {
                ...state,
                ...action.settings,
                pending: false
            }

        case FETCH_SETTINGS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }

        case SAVE_SETTINGS_PENDING:
            return {
                ...state,
                repoStatus: RepoStatus.Empty,
                save_pending: true
            }

        case SAVE_SETTINGS_SUCCESS:
            return {
                ...state,
                ...action.settings,
                save_pending: false
            }

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
