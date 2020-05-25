import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Configure, Header, Button, Icon } from 'components';
import { useTranslation } from 'react-i18next';

const Configuration: React.FC = () => { 
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <Header title="School CI Server">
                <Link to="/settings">
                    <Button size="s">
                        <Icon className="button__icon" type="settings" size="xs"></Icon>
                        <span className="button__text">{t('settings')}</span>
                    </Button>
                </Link>
            </Header>
            <Layout align="center">
                <Configure/>
            </Layout>
        </React.Fragment>
    );
}

export default Configuration;
