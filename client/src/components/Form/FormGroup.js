import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import './FormGroup.scss';

const FormGroup = ({direction, className, required, children}) => {

    const formGroupClass = ClassNames(
        'form-group',
        'form-group_direction_' + direction,
        className,
        {
            'form-group_required': required,
        }
    );

    return (
        <div className={formGroupClass}>
            {children}
        </div>
    );
}

FormGroup.propTypes = {
    required: PropTypes.bool,
    direction: PropTypes.string
}

FormGroup.defaultProps = {
    required: false,
    direction: 'column'
}

export default FormGroup;