import React from 'react';
import './Configure.scss';
import { Button, Icon } from 'components';
import {useTranslation} from 'react-i18next';

const Configure: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="configure">
            <Icon className="configure__icon" type="configure" size="xxxxl"></Icon>
            <p className="configure__title text text_primary">
                {t('configure.description')}
            </p>
            <Button variant="action" size="m" to="/settings">
                {t('configure.openSettings')}
            </Button>
        </div>
    )
}

export default Configure;
