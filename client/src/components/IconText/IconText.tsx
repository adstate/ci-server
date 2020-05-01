import React from 'react';
import classNames from 'classnames';
import './IconText.scss';
import Icon from '../Icon/Icon';

interface IconTextProps {
    icon: string;
    className?: string;
}

const IconText: React.FC<IconTextProps> = (props) => {
    const iconTextClass: string = classNames(
        'icon-text',
        props.className
    );

    return (
        <div className={iconTextClass}>
            <Icon className="icon-text__icon" type={props.icon} size="s"></Icon>
            <span className="icon-text__text">{props.children}</span>
        </div>
    )
}

export default IconText;
