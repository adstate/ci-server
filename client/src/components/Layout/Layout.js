import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Layout.scss';


const Layout = ({align, container, children}) => {
    const layoutClass = classNames('layout', {
        'layout_align_center': align === 'center',
        'layout_space-h_small': container
    });

    return (
        <div className={layoutClass}>
            {children}
        </div>
    )
}

Layout.propTypes = {
    align: PropTypes.string
}

Layout.defaultProps = {
    align: null
}

export default Layout;