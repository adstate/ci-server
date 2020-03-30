import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Classnames from 'classnames';
import './FormField.scss';

import {Icon} from 'components';

const FormField = ({type,  name, formRef, errors, size, cleared, align, placeholder, defaultValue}) => {

    const [value, setValue] = useState(defaultValue);

    const fieldClass = Classnames('form-field', {
        'form-field_size_s': size === 's',
        'form-field_invalid': errors
    });

    const inputClass = Classnames('form-field__input', {
        'form-field__input_type_number': align === 'right'
    });

    const clearInput = () => {
        setValue('');
    }

    const inputChange = (event) => {
        setValue(event.target.value);
    }

    const clearIconElement = cleared ? <Icon className="form-field__icon" size="s" type="clear" onClick={clearInput}/> : null;

    return (
        <div className={fieldClass}>
            <input type={type} ref={formRef} name={name} className={inputClass} placeholder={placeholder} value={value} onChange={(event) => inputChange(event)}/>
            {clearIconElement}
        </div>
    );
}

FormField.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    cleared: PropTypes.bool,
    align: PropTypes.string
}

FormField.defaultProps = {
    type: 'text',
    size: null,
    placeholder: '',
    defaultValue: '',
    cleared: true,
    align: 'left'
}

export default FormField;