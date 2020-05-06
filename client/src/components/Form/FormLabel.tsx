import React from 'react';
import ClassNames from 'classnames';
import './FormLabel.scss';

const FormLabel: React.FC = (props) => {
    const labelClass: string = ClassNames('form-label');

    return (
        <div className={labelClass}>
            {props.children}
        </div>
    );
}

export default FormLabel;
