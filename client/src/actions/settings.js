import {
    SAVE_SETTINGS_PENDING,
    SAVE_SETTINGS_SUCCESS,
    SAVE_SETTINGS_ERROR,
    FETCH_SETTINGS_PENDING,
    FETCH_SETTINGS_SUCCESS,
    FETCH_SETTINGS_ERROR
} from './actionTypes';

import api from '../services/api';


export const fetchSettingsPending = () => ({
    type: FETCH_SETTINGS_PENDING
});

export const fetchSettingsSuccess = (settings) => ({
    type: FETCH_SETTINGS_SUCCESS,
    settings
});

export const fetchSettingsError = (error) => ({
    type: FETCH_SETTINGS_ERROR,
    error
});

export const saveSettingsPending = () => ({
    type: SAVE_SETTINGS_PENDING
});

export const saveSettingsSuccess = (settings) => ({
    type: SAVE_SETTINGS_SUCCESS,
    settings
});

export const saveSettingsError = (error) => ({
    type: SAVE_SETTINGS_ERROR,
    error
});

export const fetchSettings = () => {
    return dispatch => {
        dispatch(fetchSettingsPending());
        
        api.getSettings()
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(fetchSettingsSuccess({
                    ...res.data,
                    ...{repoStatus: res.repoStatus}
                }));
            })
            .catch(error => {
                dispatch(fetchSettingsError(error));
            })
    }
}

export const postSettings = (settings) => {
    return dispatch => {
        dispatch(saveSettingsPending());
        
        api.saveSettings(settings)
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }

                dispatch(saveSettingsSuccess(settings));
            })
            .catch(error => {
                dispatch(saveSettingsError(error));
            })
    }
}
