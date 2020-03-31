import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { useForm } from "react-hook-form";
import {Button, FormField, FormGroup, FormLabel, FormError, Loader} from 'components';
import {fetchSettings, postSettings} from 'actions/settings';

import './SettingForm.scss';


const SettingForm = ({settings, saveSettings, getSettings}) => {
    const { handleSubmit, register, errors } = useForm();
    const onSubmit = (values) => {
        saveSettings(values);
    };

    useEffect(() => {
        if (settings.id && settings.repoStatus !== 'Cloned') {
            getSettings();
        }
    }, []);
  
    if (settings.pending !== false) {
        return (
            <Loader/>
        )
    }

    const waitingCloneRepo = settings.repoStatus === 'Cloning' || settings.save_pending;
    const repoNotCloned = settings.repoStatus === 'NotCloned';

    return (
        <div className="section">
            <div className="layout__container">
                <form className="setting-form form" name="settings" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form__header">
                        <div className="form__title">Settings</div>
                        <div className="form__subtitle">Configure repository connection and synchronization settings.</div>

                        { 
                            (waitingCloneRepo) ? 
                            <div className="setting-form__repo-status text text_secondary">Cloning repository...</div>
                            : null
                        }

                        {
                            (repoNotCloned) ?
                            <div className="setting-form__repo-status text text_error">Error of cloning repository</div>
                            : null
                        }

                    </div>

                    <FormGroup required>
                        <FormLabel>GitHub repository</FormLabel>
                        <FormField name="repoName"
                            formRef={register({required: 'repoName is required'})}
                            errors={errors.repoName}
                            icon="clear" placeholder="user-name/repo-name"
                            defaultValue={settings.repoName}
                        >
                        </FormField>
                        <FormError>
                            {errors.repoName && errors.repoName.message}
                        </FormError>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Build command</FormLabel>
                        <FormField name="buildCommand"
                            formRef={register({required: 'buildCommand is required'})}
                            errors={errors.buildCommand}
                            placeholder="npm run ..." icon="clear"
                            defaultValue={settings.buildCommand}>
                        </FormField>
                        <FormError>
                            {errors.buildCommand && errors.buildCommand.message}
                        </FormError>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Main branch</FormLabel>
                        <FormField name="mainBranch" formRef={register({})} placeholder="master" icon="clear" defaultValue={settings.mainBranch}></FormField>
                    </FormGroup>

                    <FormGroup direction="row">
                        <FormLabel>Synchronize every</FormLabel>
                        <FormField name="period"
                            formRef={register({required: 'Required'})}
                            errors={errors.period}
                            size="s" defaultValue={`${settings.period}`}
                            align="right" cleared={false}>
                        </FormField>
                        <div className="form__control-postfix">minutes</div>
                    </FormGroup>

                    <FormGroup className="setting-form__footer form__footer" direction="row">
                        <Button type="submit" className="setting-form__button setting-form__submit" variant="action" size="m" disabled={waitingCloneRepo}>Save</Button>                    
                        <Button type="reset" className="setting-form__button" variant="default" size="m" to="/" disabled={waitingCloneRepo}>Candel</Button>
                    </FormGroup>
                </form>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    settings: state.settings
});
  
const mapDispatchToProps = dispatch => ({
    saveSettings: (data) => dispatch(postSettings(data)),
    getSettings: () => dispatch(fetchSettings())
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingForm);
