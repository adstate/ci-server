import React from 'react';
import PropTypes from 'prop-types';
import './Link.scss';

const Link = ({href, children}) => {
    return (
        <a className="link" href={href}>{children}</a>
    )
}

Link.propTypes = {
    href: PropTypes.string.isRequired
}

export default Link;