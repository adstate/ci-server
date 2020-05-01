import React from 'react';
import './Error.scss';
import {Icon} from 'components';


const Error: React.FC = (props) => {
    return (
        <div className="loader-container">
            <div className="error">
                <Icon className="error__icon" type="fetch-error" size="l" pseudo/>            
                {props.children}
            </div>
        </div>
    );
}

export default Error;
