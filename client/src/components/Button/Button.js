import React from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.scss';

import Icon from '../Icon/Icon';

const Button = ({type, size, variant, icon, children, className, to, onClick}) => {

    const history = useHistory();

    const buttonClass = classNames(
        'button',
        `button_${variant}`,
        `button_size_${size}`,
        className,
        {
            'button_type_icon': icon,
        }
    );

    if (to) {
        return (
            <button type={type} className={buttonClass} onClick={() => history.push(to)}>
                {children}
            </button>
        )
    }

    return (
        <button type={type} className={buttonClass} onClick={onClick}>
            {children}
        </button>
    )
}

Button.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.bool,
    variant: PropTypes.string
};

Button.defaultProps = {
    type: 'button',
    size: 'm',
    icon: false,
    variant: 'default'
}

export default Button;