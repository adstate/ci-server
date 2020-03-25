import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './IconText.scss';

import Icon from '../Icon/Icon';


const IconText = ({icon, className, children}) => {

    const iconTextClass = classNames(
        'icon-text',
        className
    );

    return (
        <div className={iconTextClass}>
            <Icon className="icon-text__icon" type={icon} size="s"></Icon>
            <span className="icon-text__text">{children}</span>
        </div>
    )
}

IconText.propTypes = {
    icon: PropTypes.string.isRequired
}

export default IconText;