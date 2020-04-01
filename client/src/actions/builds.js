import {
    FETCH_BUILDS_PENDING,
    FETCH_BUILDS_SUCCESS,
    FETCH_BUILDS_ERROR,
    FETCH_BUILD_PENDING,
    FETCH_BUILD_SUCCESS,
    FETCH_BUILD_ERROR,
    ADD_BUILD_PENDING,
    ADD_BUILD_SUCCESS,
    ADD_BUILD_ERROR,
    BUILDS_UPDATE_OFFSET,
    BUILDS_CLEAR_STATE
} from './actionTypes';

import api from '../services/api';

export const fetchBuildsPending = () => ({
    type: FETCH_BUILDS_PENDING
});

export const fetchBuildsSuccess = (builds) => ({
    type: FETCH_BUILDS_SUCCESS,
    builds
});

export const fetchBuildsError = (error) => ({
    type: FETCH_BUILDS_ERROR,
    error
});

export const fetchBuildPending = () => ({
    type: FETCH_BUILD_PENDING
});

export const fetchBuildSuccess = (build) => ({
    type: FETCH_BUILD_SUCCESS,
    build
});

export const fetchBuildError = (error) => ({
    type: FETCH_BUILD_ERROR,
    error
});

export const addBuildPending = () => ({
    type: ADD_BUILD_PENDING
});

export const addBuildSuccess = (build) => ({
    type: ADD_BUILD_SUCCESS,
    build
});

export const addBuildError = () => ({
    type: ADD_BUILD_ERROR
});

export const buildsUpdateOffset = (offset) => ({
    type: BUILDS_UPDATE_OFFSET,
    offset
});

export const buildsClearState = () => ({
    type: BUILDS_CLEAR_STATE
});

export const fetchBuilds = (params) => {
    return (dispatch) => {
        dispatch(fetchBuildsPending());

        api.getBuilds(params)
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(fetchBuildsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchBuildsError(error));
            })
    }
}

export const getBuild = (buildId) => {
    return (dispatch) => {
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

export const addBuild = (commitHash) => {
    return (dispatch) => {
        dispatch(addBuildPending());

        api.addBuild(commitHash)
            .then(res => {
                if(res.error) {
                    throw(res.error);
                }
                dispatch(addBuildSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(addBuildError(error));
            })
    }
}