import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.scss';

import Icon from '../Icon/Icon';

const Button = ({type, size, variant, icon, children, className}) => {
    const buttonClass = classNames('button', className, {
        'button_default': variant === 'default',
        'button_action': variant === 'action',
        'button_size_s': size === 's',
        'button_size_m': size === 'm',
        'button_type_icon-text': type === 'icon-text',
      });

      //const iconElement = <Icon type={icon} size="xs" className="button__icon"/>;
      const textElement = <span className="icon-text__text button__text">{children}</span>;

    return (
        <button className={buttonClass}>
            {children}
        </button>
    )
}

Button.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
    variant: PropTypes.string
};

Button.defaultProps = {
    type: null,
    size: 'm',
    icon: null,
    variant: 'default'
}

export default Button;