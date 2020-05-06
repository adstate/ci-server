import React from 'react';
import ClassNames from 'classnames';
import './Modal.scss';


interface ModalProps {
    open: boolean;
    onClose?: () => {};
}

const Modal: React.FC<ModalProps> = (props) => {
    const modalClass: string = ClassNames(
        'modal',
        {
            'modal_open': props.open
        }
    )

    return (
        <div className={modalClass}>
            <div className="modal__dialog">
                {props.children}
            </div>
        </div>
    );
}

export default Modal;
