import React from 'react';
import classNames from 'classnames';
import './Layout.scss';

interface LayoutProps {
    align?: string;
    container?: boolean;
}

const Layout: React.FC<LayoutProps> = (props) => {
    const layoutClass: string = classNames('layout', {
        'layout_align_center': props.align === 'center',
        'layout_space-h_small': props.container
    });

    return (
        <div className={layoutClass}>
            {props.children}
        </div>
    )
}

export default Layout;
