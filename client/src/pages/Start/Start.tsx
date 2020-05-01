import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Header, Loader, Error } from 'components';
import { BuildHistory, Configuration } from 'pages';


const Start: React.FC = () => {
    const settings = useSelector((state: any) => state.settings); // TODO

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

    if (settings.error) {
        return (
            <React.Fragment>
                <Header title="School CI Server"></Header>
                <Layout align="center">
                    <Error>Error of fetching</Error>
                </Layout>
            </React.Fragment>            
        )
    }
    
    if (settings.id && ['Cloned', 'Empty'].includes(settings.repoStatus)) {
        return <BuildHistory/>
    }
    
    return <Configuration/>
}

export default Start;
