import React from 'react';
import Convert from 'ansi-to-html';
import './BuildLog.scss';
import testLog from './testBuildLog';

const convert = new Convert({
    fg: '#000'
});

const BuildLog = ({children, test}) => {
    const log = (test) ? testLog : children;

    const createMarkup = () => {
        return {__html: convert.toHtml(log)}
    }

    return (
        <pre className="build-log" dangerouslySetInnerHTML={createMarkup()}></pre>
    );
}

export default BuildLog;