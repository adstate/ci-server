import {
    SAVE_SETTINGS_PENDING,
    SAVE_SETTINGS_SUCCESS,
    SAVE_SETTINGS_ERROR,
    FETCH_SETTINGS_PENDING,
    FETCH_SETTINGS_SUCCESS,
    FETCH_SETTINGS_ERROR,
    SettingsActionTypes
} from './actionTypes';
import api from '../services/api';
import {ConfigurationInput, SettingsResponse} from '../../../webserver/src/models';
import Settings from '../models/settings';


export const fetchSettingsPending = (): SettingsActionTypes => ({
    type: FETCH_SETTINGS_PENDING
});

export const fetchSettingsSuccess = (settings: Settings): SettingsActionTypes => ({
    type: FETCH_SETTINGS_SUCCESS,
    settings
});

export const fetchSettingsError = (error: any): SettingsActionTypes => ({
    type: FETCH_SETTINGS_ERROR,
    error
});

export const saveSettingsPending = (): SettingsActionTypes => ({
    type: SAVE_SETTINGS_PENDING
});

export const saveSettingsSuccess = (settings: ConfigurationInput): SettingsActionTypes => ({
    type: SAVE_SETTINGS_SUCCESS,
    settings
});

export const saveSettingsError = (error: any): SettingsActionTypes => ({
    type: SAVE_SETTINGS_ERROR,
    error
});

export const fetchSettings = () => {
    return (dispatch: any) => {
        dispatch(fetchSettingsPending());
        
        api.getSettings()
            .then((res: SettingsResponse) => {
                if (!res.data) {
                    throw Error('Settings is not loaded');
                }

                dispatch(fetchSettingsSuccess({
                    ...res.data,
                    ...{repoStatus: res.repoStatus}
                }));
            })
            .catch(error => {
                console.log('error', error);
                dispatch(fetchSettingsError(error));
            })
    }
}

export const postSettings = (settings: ConfigurationInput) => {
    return (dispatch: any) => {
        dispatch(saveSettingsPending());
        
        api.saveSettings(settings)
            .then((res: SettingsResponse | {}) => {
                dispatch(saveSettingsSuccess(settings));
            })
            .catch(error => {
                dispatch(saveSettingsError(error));
            })
    }
}
