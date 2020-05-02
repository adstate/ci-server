import {ConfigurationModel, RepoStatus} from '../../../webserver/src/models';

export default interface Settings extends ConfigurationModel {
    repoStatus?: RepoStatus
}