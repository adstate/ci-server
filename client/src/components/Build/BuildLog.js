import React from 'react';
import PropTypes from 'prop-types';
import './BuildLog.scss';

const BuildLog = ({children}) => {
    return (
        <pre className="build-log">
            {children}
        </pre>
    );
}

BuildLog.propTypes = {

}

BuildLog.defaultProps = {
    
}

export default BuildLog;