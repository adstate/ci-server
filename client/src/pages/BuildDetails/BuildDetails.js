import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import Convert from 'ansi-to-html';

import {Button, Icon, Layout, Header, Build, BuildLog, Loader, Error} from 'components';
import {
    fetchBuildSuccess,
    fetchBuildPending,
    fetchBuildError,
    addBuildPending,
    addBuildSuccess,
    addBuildError
} from 'actions/builds';

import api from 'services/api';


const BuildDetails = () => {
    const { id } = useParams();
    const build = useSelector(state => state.builds.items.find(build => build.id === id));
    const pending = useSelector(state => state.builds.get_build_pending);
    const fetchError = useSelector(state => state.builds.error);

    const settings = useSelector(state => state.settings);

    const history = useHistory();
    const dispatch = useDispatch();
    
    const [log, setLog] = useState('');

    const convert = new Convert();

    useEffect(() => {
        if (!build) {
            dispatch(fetchBuildPending());
            api.getBuild(id)
                .then(res => {
                    const build = res.data;
                    dispatch(fetchBuildSuccess(build));

                    if (['Success', 'Fail'].includes(build.status)) {
                        return api.getBuildLog(id);
                    }
                })
                .then(res => {
                    if (res) {
                        setLog(res.replace(/\\n/g, '\n'));
                    }
                })
                .catch(error => {
                    dispatch(fetchBuildError(error));
                });
        } else {
            if (['Success', 'Fail'].includes(build.status)) {
                api.getBuildLog(id).then(res => {
                    setLog(res.replace(/\\n/g, '\n'));
                });
            }
        }
    }, []);

    const rebuildHandler = () => {
        dispatch(addBuildPending());

        api.addBuild(build.commitHash)
            .then(res => {
                if(res.error) {
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
                    <div className="layout__container">
                        <Build detailed data={build}></Build>
                        <BuildLog>
                            {convert.toHtml(log)}
                        </BuildLog>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    );
}

export default BuildDetails;
