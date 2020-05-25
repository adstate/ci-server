import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Header, Loader, Error } from 'components';
import { BuildHistory, Configuration } from 'pages';
import {RootState} from 'reducers';
import { useTranslation } from 'react-i18next';


const Start: React.FC = () => {
    const settings = useSelector((state: RootState) => state.settings);
    const {t} = useTranslation();

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
                    <Error>{t('fetchError')}</Error>
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
