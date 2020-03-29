import React from 'react';
import ClassNames from 'classnames';
import './FormLabel.scss';

const FormLabel = ({children}) => {

    const labelClass = ClassNames('form-label');

    return (
        <div className={labelClass}>
            {children}
        </div>
    );
}

export default FormLabel;