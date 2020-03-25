import React from 'react';
import { Link } from 'react-router-dom'
import './Configure.scss';

import { Button, Icon } from '../../components';

const Configure = () => {
    return (
        <div className="configure">
            <Icon className="configure__icon" type="configure" size="xxxxl"></Icon>
            <p className="configure__title text text_primary">
                Configure repository connection and synchronization settings
            </p>
            <Link to="/settings">
                <Button variant="action" size="m">Open settings</Button>
            </Link>
        </div>
    )
}

export default Configure;