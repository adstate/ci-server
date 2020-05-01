import React from 'react';
import './Configure.scss';
import { Button, Icon } from 'components';

const Configure: React.FC = () => {
    return (
        <div className="configure">
            <Icon className="configure__icon" type="configure" size="xxxxl"></Icon>
            <p className="configure__title text text_primary">
                Configure repository connection and synchronization settings
            </p>
            <Button variant="action" size="m" to="/settings">Open settings</Button>
        </div>
    )
}

export default Configure;
