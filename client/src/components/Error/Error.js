import React from 'react';
import './Error.scss';

import {Icon} from 'components';


const Error = ({children}) => {
    return (
        <div className="error">
            <Icon className="error__icon" type="fetch-error" size="l" pseudo/>            
            {children}
        </div>
    );
}

export default Error;