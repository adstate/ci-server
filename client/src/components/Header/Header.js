import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const Header = ({title}) => {
    return (
        <div className="header">
            <div className="header__content">
                <h1 className="header__title text text_link">{title}</h1>
                <Button type="icon-text" icon="settings" size="s">
                    <Icon className="button__icon" type="settings" size="xs"></Icon>
                    <span className="button__text">Settings</span>
                </Button>
            </div>
        </div>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired
};

export default Header;