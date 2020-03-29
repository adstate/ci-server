import {
    SAVE_SETTINGS_SUCCESS,
    FETCH_SETTINGS_PENDING,
    FETCH_SETTINGS_SUCCESS,
    FETCH_SETTINGS_ERROR 
} from '../constants/actionTypes';

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

export const saveSettingsSuccess = (settings) => ({
    type: SAVE_SETTINGS_SUCCESS,
    settings
});

export const fetchSettings = () => {
    return dispatch => {
        dispatch(fetchSettingsPending());
        
        api.getSettings()
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchSettingsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchSettingsError(error));
            })
    }
}

export const postSettings = (settings) => {
    return dispatch => {
        dispatch(fetchSettingsPending());
        
        api.getSettings()
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(saveSettingsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchSettingsError(error));
            })
    }
}
