import RepoStatus from './repoStatus';
import {ConfigurationModelApiResponse} from './configurationModelApiResponse';

export default interface SettingsResponse extends ConfigurationModelApiResponse {
    status: string;
    repoStatus?: RepoStatus
}