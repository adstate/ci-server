import React from 'react';
import { useHistory } from "react-router-dom";
import {History} from 'history';
import classNames from 'classnames';
import './Button.scss';

interface ButtonProps {
    type?: "button" | "submit" | "reset" | undefined;
    size: string;
    variant?: string;
    icon?: boolean;
    className?: string;
    disabled?: boolean;
    to?: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    type = 'button',
    size = 'm',
    variant = 'default',
    icon,
    children,
    className,
    disabled,
    to,
    onClick
}) => {
    const history: History = useHistory();

    const buttonClass: string = classNames(
        'button',
        `button_${variant}`,
        `button_size_${size}`,
        className,
        {
            'button_disabled': disabled,
            'button_type_icon': icon,
        }
    );

    if (to) {
        return (
            <button type={type} className={buttonClass} onClick={() => history.push(to)} disabled={disabled}>
                {children}
            </button>
        )
    }

    return (
        <button type={type} className={buttonClass} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button;
