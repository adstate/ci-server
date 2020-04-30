import {BuildModel} from './buildModel';

export default interface GetBuildResponse {
    status: string;
    data?: BuildModel;
}