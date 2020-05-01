import React, {useEffect} from 'react';
import { useForm } from "react-hook-form";
import {Button, FormField, FormGroup, FormError, Modal} from 'components';
import './NewBuild.scss';


interface NewBuildProps {
    open: boolean;
    onClose: () => void;
    onRunBuild: (commitHash: string) => void;
    pending: boolean;
}

interface newBuildForm {
    commitHash: string;
}

const NewBuild: React.FC<NewBuildProps> = ({open, onClose, onRunBuild, pending}) => {
    const { handleSubmit, register, errors, reset } = useForm<newBuildForm>();
    
    const onSubmit = (values: newBuildForm) => {
        onRunBuild(values.commitHash);
    };

    useEffect(() => {
        if (open) {
            reset({commitHash: ''});
        }
    }, [open]);

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
                        placeholder="Commit hash"
                    >
                    </FormField>
                    <FormError>
                        {errors.commitHash && errors.commitHash.message}
                    </FormError>
                </FormGroup>

                <FormGroup space="m" className="setting-form__footer form__footer" direction="row">
                    <Button type="submit" className="setting-form__button setting-form__submit" variant="action" size="m" disabled={pending === true}>Run build</Button>                    
                    <Button type="reset" className="setting-form__button" variant="default" size="m" onClick={onClose} disabled={pending === true}>Candel</Button>
                </FormGroup>
            </form>
        </Modal>
    )
}

export default NewBuild;
