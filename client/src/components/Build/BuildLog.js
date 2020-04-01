import React, {useEffect} from 'react';
import Convert from 'ansi-to-html';

import './BuildLog.scss';

import testLog from './testBuildLog';

const BuildLog = ({children, test}) => {
    const convert = new Convert({
        fg: '#000'
    });

    const log = (test) ? testLog : children;

    const createMarkup = () => {
        return {__html: convert.toHtml(log)}
    }

    return (
        <pre className="build-log" dangerouslySetInnerHTML={createMarkup()}></pre>
    );
}

export default BuildLog;