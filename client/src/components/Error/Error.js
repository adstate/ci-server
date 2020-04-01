import React from 'react';
import './Error.scss';


const Error = ({children}) => {
    return (
        <div className="error">{children}</div>
    );
}

export default Error;