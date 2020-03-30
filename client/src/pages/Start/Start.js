import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Layout, Header, Loader } from 'components';
import { BuildHistory, Configuration } from 'pages';


const Start = () => {
    const settings = useSelector(state => state.settings);

    if (settings.pending !== false) {
        return (
            <React.Fragment>
                <Header title="School CI Server"></Header>
                <Layout align="center">
                    <Loader/>
                </Layout>
            </React.Fragment>
        );
    }
    
    if (settings.id && ['Cloned', 'Empty'].includes(settings.repoStatus)) {
        return <BuildHistory/>
    }
    
    return <Configuration/>
}

export default Start;
