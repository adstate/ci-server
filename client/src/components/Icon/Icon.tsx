import React from 'react';
import classNames from 'classnames';
import './Icon.scss';


interface IconProps {
    type: string;
    size?: string;
    pseudo?: boolean;
    className?: string;
    onClick?: () => void;
}

const Icon: React.FC<IconProps> = (props) => {
    const iconClass: string = classNames(
        'icon',
        'icon_size_' + (props.size || 's'),
        'icon_type_' + props.type,
        props.className, 
        {
            'icon_pseudo': props.pseudo
        }
    );

    return (
        <span className={iconClass} onClick={props.onClick}></span>
    )
}

export default Icon;
