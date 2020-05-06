import React from 'react';
import Convert from 'ansi-to-html';
import './BuildLog.scss';

const convert: Convert = new Convert({
    fg: '#000'
});

const BuildLog: React.FC = (props) => {
    const createMarkup = () => {
        return {__html: convert.toHtml(props.children)}
    }

    return (
        <pre className="build-log" dangerouslySetInnerHTML={createMarkup()}></pre>
    );
}

export default BuildLog;
