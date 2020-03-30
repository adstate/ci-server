import React from 'react';
import './FormError.scss';


const FormError = ({children}) => {

    return (
        <div className="form-error">
            {children}
        </div>
    )
}


export default FormError;