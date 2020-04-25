import React from 'react';
import ClassNames from 'classnames';
import './Modal.scss';


const Modal = ({open, onClose, children}) => {
    const modalClass = ClassNames(
        'modal',
        {
            'modal_open': open
        }
    )

    return (
        <div className={modalClass}>
            <div className="modal__dialog">
                {children}
            </div>
        </div>
    );
}

export default Modal;