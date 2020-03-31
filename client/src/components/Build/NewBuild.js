import React from 'react';
import { connect } from 'react-redux';
import { useForm } from "react-hook-form";
import {Button, FormField, FormGroup, FormError, Modal} from 'components';
import './NewBuild.scss';


const NewBuild = ({open, onClose}) => {
    const { handleSubmit, register, errors } = useForm();
    const onSubmit = (values) => {
        console.log('submit');
    };

    return (
        <Modal open={open}>
            <form className="new-build form" onSubmit={handleSubmit(onSubmit)}>
                <div className="new-build__title form__title">
                    New build
                </div>
                <div className="new-build__subtitle form__subtitle">
                    Enter the commit hash which you want to build.
                </div>
                <FormGroup space="m">
                    <FormField name="commitHash"
                        formRef={register({required: true})}
                        errors={errors.commitHash}
                        icon="clear" placeholder="Commit hash"
                    >
                    </FormField>
                    <FormError>
                        {errors.commitHash && errors.commitHash.message}
                    </FormError>
                </FormGroup>

                <FormGroup space="m" className="setting-form__footer form__footer" direction="row">
                    <Button type="submit" className="setting-form__button setting-form__submit" variant="action" size="m" disabled={false}>Run build</Button>                    
                    <Button type="reset" className="setting-form__button" variant="default" size="m" disabled={false} onClick={onClose}>Candel</Button>
                </FormGroup>
            </form>
        </Modal>
    )
}

export default NewBuild;