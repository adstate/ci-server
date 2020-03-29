import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Icon.scss';


const Icon = ({type, size, className, onClick}) => {

    const iconClass = classNames(
        'icon',
        'icon_size_' + size,
        'icon_type_' + type,
        className
    );

    return (
        <span className={iconClass} onClick={onClick}></span>
    )
}

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    size: PropTypes.string
}

export default Icon;