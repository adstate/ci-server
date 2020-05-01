import React from 'react';
import './FormError.scss';

const FormError: React.FC = (props) => {
    return (
        <div className="form-error">
            {props.children}
        </div>
    )
}

export default FormError;
