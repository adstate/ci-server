import React from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.scss';

import Button from '../Button/Button';
import Icon from '../Icon/Icon';

const Header = ({title, children}) => {
    const history = useHistory();
    const linkClickHandler = () => history.push('/');

    return (
        <div className="header">
            <div className="header__content">
                <h1 className="header__title text text_link" onClick={linkClickHandler}>{title}</h1>
                {children}
            </div>
        </div>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired
};

export default Header;