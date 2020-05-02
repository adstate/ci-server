import {BuildModel, ConfigurationInput} from '../../../webserver/src/models';
import { BuildRequestResult } from '../../../webserver/src/models/buildRequestResponse';
import Settings from '../models/settings'


interface FetchSettingsPendingAction {
    type: typeof FETCH_SETTINGS_PENDING
}

interface FetchSettingsSuccessAction {
    type: typeof FETCH_SETTINGS_SUCCESS,
    settings: Settings
}

interface FetchSettingsErrorAction {
    type: typeof FETCH_SETTINGS_ERROR,
    error: Error
};

interface SaveSettingsPendingAction {
    type: typeof SAVE_SETTINGS_PENDING
}

interface SaveSettingsSuccessAction {
    type: typeof SAVE_SETTINGS_SUCCESS,
    settings: ConfigurationInput
}

interface SaveSettingsErrorAction {
    type: typeof SAVE_SETTINGS_ERROR,
    error: Error
}

export type SettingsActionTypes = FetchSettingsPendingAction | FetchSettingsSuccessAction | FetchSettingsErrorAction
                                  | SaveSettingsPendingAction | SaveSettingsSuccessAction | SaveSettingsErrorAction;


interface FetchBuildsPendingAction {
    type: typeof FETCH_BUILDS_PENDING
}

interface FetchBuildsSuccessAction {
    type: typeof FETCH_BUILDS_SUCCESS;
    builds: BuildModel[]
}

interface FetchBuildsErrorAction {
    type: typeof FETCH_BUILDS_ERROR;
    error: Error
}

interface FetchBuildPendingAction {
    type: typeof FETCH_BUILD_PENDING
}

interface FetchBuildSuccessAction {
    type: typeof FETCH_BUILD_SUCCESS;
    build: BuildModel
}

interface FetchBuildErrorAction {
    type: typeof FETCH_BUILD_ERROR;
    error: Error
}

interface AddBuildPendingAction {
    type: typeof ADD_BUILD_PENDING
}

interface AddBuildSuccessAction {
    type: typeof ADD_BUILD_SUCCESS;
    build: BuildRequestResult
}

interface AddBuildErrorAction {
    type: typeof ADD_BUILD_ERROR
}

interface AddBuildToViewAction {
    type: typeof ADD_BUILD_TO_VIEW;
    build: BuildModel
}

interface ClearBuildToViewAction {
    type: typeof CLEAR_BUILD_TO_VIEW
}

interface FetchBuildLogSuccessAction {
    type: typeof FETCH_BUILD_LOG_SUCCESS;
    log: string;
}

interface fetchBuildLogErrorAction {
    type: typeof FETCH_BUILD_LOG_ERROR,
    error: Error
}

interface buildsUpdateOffsetAction {
    type: typeof BUILDS_UPDATE_OFFSET,
    offset: number
}

interface buildsClearState {
    type: typeof BUILDS_CLEAR_STATE
}

export type BuildsActionTypes = FetchBuildsPendingAction | FetchBuildsSuccessAction | FetchBuildsErrorAction | FetchBuildPendingAction
                                | FetchBuildSuccessAction | FetchBuildErrorAction | AddBuildPendingAction | AddBuildSuccessAction
                                | AddBuildErrorAction | AddBuildToViewAction | ClearBuildToViewAction | FetchBuildLogSuccessAction
                                | fetchBuildLogErrorAction |  buildsUpdateOffsetAction | buildsClearState;
                             
export const FETCH_SETTINGS_PENDING = 'FETCH_SETTINGS_PENDING';
export const FETCH_SETTINGS_SUCCESS = 'FETCH_SETTINGS_SUCCESS';
export const FETCH_SETTINGS_ERROR = 'FETCH_SETTINGS_ERROR';
export const SAVE_SETTINGS_PENDING = 'SAVE_SETTINGS_PENDING';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_ERROR = 'SAVE_SETTINGS_ERROR';

export const FETCH_BUILDS_PENDING = 'FETCH_BUILDS_PENDING';
export const FETCH_BUILDS_SUCCESS = 'FETCH_BUILDS_SUCCESS';
export const FETCH_BUILDS_ERROR = 'FETCH_BUILDS_ERROR';
export const BUILDS_UPDATE_OFFSET = 'BUILDS_UPDATE_OFFSET';
export const BUILDS_CLEAR_STATE = 'BUILDS_CLEAR_STATE';

export const FETCH_BUILD_PENDING = 'FETCH_BUILD_PENDING';
export const FETCH_BUILD_SUCCESS = 'FETCH_BUILD_SUCCESS';
export const FETCH_BUILD_ERROR = 'FETCH_BUILD_ERROR';
export const FETCH_BUILD_LOG_SUCCESS = 'FETCH_BUILD_LOG_SUCCESS';
export const FETCH_BUILD_LOG_ERROR = 'FETCH_BUILD_LOG_ERROR';
export const ADD_BUILD_PENDING = 'ADD_BUILD_PENDING';
export const ADD_BUILD_SUCCESS = 'ADD_BUILD_SUCCESS';
export const ADD_BUILD_ERROR = 'ADD_BUILD_ERROR';
export const ADD_BUILD_TO_VIEW = 'ADD_BUILD_TO_VIEW';
export const CLEAR_BUILD_TO_VIEW = 'CLEAR_BUILD_TO_VIEW';