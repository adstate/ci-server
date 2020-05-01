import React, {useState} from 'react';
import Classnames from 'classnames';
import './FormField.scss';
import {Icon} from 'components';

interface FormFieldProps {
    type?: string;
    name: string;
    size?: string;
    formRef?: any; //TODO
    errors?: any; //TODO
    placeholder?: string;
    defaultValue?: string;
    cleared?: boolean;
    align?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    type = 'text',
    align = 'left',
    size = '',
    placeholder = '',
    defaultValue = '',
    cleared = true,
    name,
    formRef,
    errors
}) => {
    const [value, setValue] = useState(defaultValue);

    const fieldClass: string = Classnames('form-field', {
        'form-field_size_s': size === 's',
        'form-field_invalid': errors
    });

    const inputClass: string = Classnames('form-field__input', {
        'form-field__input_type_number': align === 'right'
    });

    const clearInput = () => {
        setValue('');
    }

    const inputChange = (event: any) => {
        setValue(event.target.value);
    }

    return (
        <div className={fieldClass}>
            <input type={type} ref={formRef} name={name} className={inputClass} placeholder={placeholder} value={value} onChange={inputChange}/>
            {cleared && <Icon className="form-field__icon" size="s" type="clear" onClick={clearInput}/>}
        </div>
    );
}

export default FormField;
