import {
    FETCH_BUILDS_PENDING,
    FETCH_BUILDS_SUCCESS,
    FETCH_BUILDS_ERROR,
    FETCH_BUILD_PENDING,
    FETCH_BUILD_SUCCESS,
    FETCH_BUILD_ERROR,
    FETCH_BUILD_LOG_SUCCESS,
    FETCH_BUILD_LOG_ERROR,
    ADD_BUILD_PENDING,
    ADD_BUILD_SUCCESS,
    ADD_BUILD_ERROR,
    ADD_BUILD_TO_VIEW,
    CLEAR_BUILD_TO_VIEW,
    BUILDS_UPDATE_OFFSET,
    BUILDS_CLEAR_STATE,
    BuildsActionTypes
} from './actionTypes';
import api from 'services/api';
import {History} from 'history';
import {BuildModel, QueueBuildInput} from '../../../webserver/src/models';
import { BuildRequestResult } from '../../../webserver/src/models/buildRequestResponse';

export const fetchBuildsPending = (): BuildsActionTypes => ({
    type: FETCH_BUILDS_PENDING
});

export const fetchBuildsSuccess = (builds: BuildModel[]): BuildsActionTypes => ({
    type: FETCH_BUILDS_SUCCESS,
    builds
});

export const fetchBuildsError = (error: Error): BuildsActionTypes => ({
    type: FETCH_BUILDS_ERROR,
    error
});

export const fetchBuildPending = (): BuildsActionTypes => ({
    type: FETCH_BUILD_PENDING
});

export const fetchBuildSuccess = (build: BuildModel): BuildsActionTypes => ({
    type: FETCH_BUILD_SUCCESS,
    build
});

export const fetchBuildError = (error: Error) => ({
    type: FETCH_BUILD_ERROR,
    error
});

export const addBuildPending = (): BuildsActionTypes => ({
    type: ADD_BUILD_PENDING
});

export const addBuildSuccess = (build: BuildRequestResult): BuildsActionTypes => ({
    type: ADD_BUILD_SUCCESS,
    build
});

export const addBuildError = (): BuildsActionTypes => ({
    type: ADD_BUILD_ERROR
});

export const addBuildToView = (build: BuildModel): BuildsActionTypes => ({
    type: ADD_BUILD_TO_VIEW,
    build
});

export const clearBuildToView = (): BuildsActionTypes => ({
    type: CLEAR_BUILD_TO_VIEW
});

export const fetchBuildLogSuccess = (log: string): BuildsActionTypes => ({
    type: FETCH_BUILD_LOG_SUCCESS,
    log
});

export const fetchBuildLogError = (error: Error): BuildsActionTypes => ({
    type: FETCH_BUILD_LOG_ERROR,
    error
});

export const buildsUpdateOffset = (offset: number): BuildsActionTypes => ({
    type: BUILDS_UPDATE_OFFSET,
    offset
});

export const buildsClearState = (): BuildsActionTypes => ({
    type: BUILDS_CLEAR_STATE
});

export const fetchBuilds = (params: {
    offset: number,
    limit: number
}) => {
    const {offset, limit} = params;

    return (dispatch: any) => {
        dispatch(buildsUpdateOffset(offset));
        dispatch(fetchBuildsPending());

        api.getBuilds({offset, limit})
            .then(res => {
                if (!res.data) {
                    throw Error('Builds are not loaded');
                }
                dispatch(fetchBuildsSuccess(res.data));
            })
            .catch(error => {
                console.log('error', error);
                dispatch(fetchBuildsError(error));
            })
    }
}

export const getBuild = (buildId: string) => {
    return (dispatch: any) => {
        dispatch(fetchBuildPending());

        api.getBuild(buildId)
            .then(res => {
                if (!res.data) {
                    throw Error('Build is not loaded');
                }
                dispatch(fetchBuildSuccess(res.data));
            })
            .catch(error => {
                dispatch(fetchBuildError(error));
            })
    }
}

export const getBuildLog = (buildId: string) => {
    return (dispatch: any) => {
        api.getBuildLog(buildId)
           .then(res => {
                dispatch(fetchBuildLogSuccess(res));
           })
           .catch(err => {
                dispatch(fetchBuildLogError(err));
           })
    }
}

export const addBuild = (commitHash: string) => {
    return (dispatch: any) => {
        dispatch(addBuildPending());

        api.addBuild(commitHash)
            .then(res => {
                if (!res.data) {
                    throw Error('Build is not added');
                }
                dispatch(addBuildSuccess(res.data));
            })
            .catch(error => {
                dispatch(addBuildError());
            })
    }
}

export const rebuild = (build: BuildModel, history: History) => {
    return (dispatch: any) => {
        dispatch(addBuildPending());

        api.addBuild(build.commitHash)
            .then(res => {
                if (!res.data) {
                    return;
                }
                dispatch(addBuildSuccess(res.data));
                history.push(`/build/${res.data.id}`);
            })
            .catch(error => {
                dispatch(addBuildError());
            })
    }
}
