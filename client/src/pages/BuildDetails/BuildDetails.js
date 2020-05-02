import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import {Button, Icon, Layout, Header, Build, BuildLog, Loader, Error} from 'components';
import {
    addBuildPending,
    addBuildSuccess,
    addBuildError,
    getBuild,
    getBuildLog
} from 'actions/builds';
import api from 'services/api';


const BuildDetails = () => {
    const { id } = useParams();

    const build = useSelector(state => state.builds.items.find(build => build.id === id));
    const {
        get_build_pending: pending,
        build_log_to_view: buildLog,
        error: fetchError,
    } = useSelector(state => state.builds);

    const settings = useSelector(state => state.settings);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!build) {
            dispatch(getBuild(id));
        }        
        dispatch(getBuildLog(id));
    }, [id, dispatch]);

    const rebuildHandler = () => {
        dispatch(addBuildPending());

        api.addBuild(build.commitHash)
            .then(res => {
                if (res.error) {
                    throw(res.error);
                }
                dispatch(addBuildSuccess(res.data));
                history.push(`/build/${res.data.id}`);
            })
            .catch(error => {
                dispatch(addBuildError(error));
            })
    }

    if (pending !== false && !build) {
        return (
            <React.Fragment>
                <Header title="School CI Server"></Header>
                <Layout align="center">
                    <Loader/>
                </Layout>
            </React.Fragment>
        )
    }

    if (fetchError) {
        return (
            <React.Fragment>
                <Header title="School CI Server"></Header>
                <Layout align="center">
                    <Error>Error of fetching</Error>
                </Layout>
            </React.Fragment>           
        )
    }

    return (
        <React.Fragment>
            <Header title={settings.repoName}>
                <div className="header__button-group">
                    <Button className="button_type_icon-text" size="s" onClick={rebuildHandler}>
                        <Icon className="button__icon" type="refresh"/>
                        <span className="button__text">Rebuild</span>
                    </Button>
                    <Button icon size="s" to="/settings">
                        <Icon class="button__icon" type="settings" size="xs"/>
                    </Button>
                </div>
            </Header>
            <Layout container>
                <div className="section">
                    <Build detailed data={build}></Build>
                    <BuildLog>{buildLog || ''}</BuildLog>
                </div>
            </Layout>
        </React.Fragment>
    );
}

export default BuildDetails;
