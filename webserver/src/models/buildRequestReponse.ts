import {BuildRequestResultModel} from './buildRequestResultModel';

export interface BuildRequestResult extends BuildRequestResultModel {
    commitMessage: string;
    commitHash: string;
    branchName: string;
    authorName: string;
}

export default interface BuildRequestReponse {
    status: string;
    data?: BuildRequestResult
}