import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import {History} from 'history';
import {Button, Icon, Layout, Header, Build, BuildLog, Loader, Error} from 'components';
import {getBuild, getBuildLog, rebuild} from 'actions/builds';
import {RootState} from 'reducers';


const BuildDetails: React.FC = () => {
    const { id } = useParams();

    const build = useSelector((state: RootState) => state.builds.items.find((build) => build.id === id));
    const {
        get_build_pending: pending,
        build_log_to_view: buildLog,
        error: fetchError,
    } = useSelector((state: RootState) => state.builds);

    const settings = useSelector((state: RootState) => state.settings);
    const history: History = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!build) {
            dispatch(getBuild(id));
        }        
        dispatch(getBuildLog(id));
    }, [id, dispatch]);

    const rebuildHandler = () => {
        if (build) {
            dispatch(rebuild(build, history));
        }
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
                        <Icon className="button__icon" type="refresh" size="xs"/>
                        <span className="button__text">Rebuild</span>
                    </Button>
                    <Button icon size="s" to="/settings">
                        <Icon className="button__icon" type="settings" size="xs"/>
                    </Button>
                </div>
            </Header>
            <Layout container>
                <div className="section">
                    <div className="layout__container">
                        {build && <Build detailed data={build}></Build>}
                        <BuildLog>{buildLog || ''}</BuildLog>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    );
}

export default BuildDetails;
