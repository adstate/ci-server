import React, {useEffect} from 'react';
import { useForm } from "react-hook-form";
import {Button, FormField, FormGroup, FormError, Modal} from 'components';
import {useTranslation} from 'react-i18next';
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
    const { t } = useTranslation();
    
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
                    {t('newBuild')}
                </div>
                <div className="new-build__subtitle form__subtitle">
                    {t('newBuildModal.description')}
                </div>
                <FormGroup space="m">
                    <FormField name="commitHash"
                        formRef={register({required: true})}
                        errors={errors.commitHash}
                        placeholder={t('newBuildModal.commitHash')}
                    >
                    </FormField>
                    <FormError>
                        {errors.commitHash && errors.commitHash.message}
                    </FormError>
                </FormGroup>

                <FormGroup space="m" className="setting-form__footer form__footer" direction="row">
                    <Button type="submit" className="setting-form__button setting-form__submit" variant="action" size="m" disabled={pending === true}>
                        {t('runBuild')}
                    </Button>
                    <Button type="reset" className="setting-form__button" variant="default" size="m" onClick={onClose} disabled={pending === true}>
                        {t('cancel')}
                    </Button>
                </FormGroup>
            </form>
        </Modal>
    )
}

export default NewBuild;
