import {
    FETCH_BUILD_PENDING,
    FETCH_BUILD_SUCCESS,
    FETCH_BUILD_ERROR
} from '../constants/actionTypes';

import api from '../services/api';

export const fetchBuildPending = () => ({
    type: FETCH_BUILD_PENDING
});

export const fetchBuildSuccess = (builds) => ({
    type: FETCH_BUILD_SUCCESS,
    builds
});

export const fetchBuildError = (error) => ({
    type: FETCH_BUILD_ERROR,
    error
});

export const getBuild = (buildId) => {
    return dispatch => {
        dispatch(fetchBuildPending());

        api.getBuild(buildId)
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchBuildSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchBuildError(error));
            })
    }
}