import React from 'react';
import { Header, Layout, SettingForm } from 'components';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
    const {t} = useTranslation();
    
    return (
        <React.Fragment>
            <Header title={t('header.ciServer')}></Header>
            <Layout container>
                <SettingForm/>
            </Layout>
        </React.Fragment>
    );
}

export default Settings;
