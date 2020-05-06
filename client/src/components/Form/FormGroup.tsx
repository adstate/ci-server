import React from 'react';
import ClassNames from 'classnames';
import './FormGroup.scss';

interface FormGroupProps {
    direction?: string;
    className?: string;
    required?: boolean;
    space?: string;
}

const FormGroup: React.FC<FormGroupProps> = (props) => {
    const formGroupClass: string = ClassNames(
        'form-group',
        'form-group_direction_' + props.direction,
        props.className,
        {
            'form-group_required': props.required,
            'form-group_space_m': props.space === 'm'
        }
    );

    return (
        <div className={formGroupClass}>
            {props.children}
        </div>
    );
}

export default FormGroup;
