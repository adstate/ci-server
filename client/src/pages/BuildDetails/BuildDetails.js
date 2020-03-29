import React, {useEffect, useState} from 'react';
import {useSelector, connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import PropTypes from 'prop-types';

import {Button, Icon, Layout, Header, Build, BuildLog, Loader} from 'components';
import {getBuild} from 'actions/builds';
import api from 'services/api';


const BuildDetails = ({loadBuild}) => {
    const { id } = useParams();
    const build = useSelector(state => state.builds.items.find(build => build.id === id));

    const [log, setLog] = useState('');

    useEffect(() => {
        if (!build) {
            loadBuild(id);
        }
    }, []);

    useEffect(() => {
        let fetch = api.getBuildLog(id).then(res => {
            setLog(res.replace(/\\n/g, '\n'));
        });

        return () => {
            fetch = null;
        }
    }, []);

    const settings = useSelector(state => state.settings);

    if (!build) {
        return (
            <React.Fragment>
                <Header title="School CI Server"></Header>
                <Layout align="center">
                    <Loader/>
                </Layout>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Header title={settings.repoName}>
                <div className="header__button-group">
                    <Button className="button_type_icon-text" size="s">
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
                            {log}
                        </BuildLog>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    builds: state.builds.items
});
  
const mapDispatchToProps = dispatch => ({
    loadBuild: (id) => dispatch(getBuild(id))
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuildDetails);