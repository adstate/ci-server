import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {Button, FormField, FormGroup, FormLabel, Loader} from 'components';
import {fetchSettings, postSettings} from 'actions/settings';

import './SettingForm.scss';


const SettingForm = ({settings, saveSettings, get}) => {

    useEffect(() => {
        if (!settings.id) {
            get();
        }
    }, []);

    if (settings.pending !== false) {
        return (
            <Loader/>
        )
    }

    const save = () => {
        console.log(document.forms.settings.elements);
    }

    return (
        <div className="section">
            <div className="layout__container">
                <form className="setting-form form" name="settings">
                    <div className="form__header">
                        <div className="form__title">Settings</div>
                        <div className="form__subtitle">Configure repository connection and synchronization settings.</div>
                    </div>

                    <FormGroup required>
                        <FormLabel>GitHub repository</FormLabel>
                        <FormField icon="clear" placeholder="user-name/repo-name" defaultValue={settings.repoName}></FormField>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Build command</FormLabel>
                        <FormField placeholder="npm run ..." icon="clear" defaultValue={settings.buildCommand}></FormField>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Main branch</FormLabel>
                        <FormField placeholder="branch for build" icon="clear" defaultValue={settings.mainBranch}></FormField>
                    </FormGroup>

                    <FormGroup direction="row">
                        <FormLabel>Synchronize every</FormLabel>
                        <FormField size="s" defaultValue={`${settings.period}`} align="right" cleared={false}></FormField>
                        <div className="form__control-postfix">minutes</div>
                    </FormGroup>

                    <FormGroup className="setting-form__footer form__footer" direction="row">
                        <Button className="setting-form__button setting-form__submit" variant="action" size="m" onClick={save}>Save</Button>
                        <Button type="reset" className="setting-form__button" variant="default" size="m" to="/">Candel</Button>
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
    saveSettings: () => dispatch(postSettings()),
    get: () => dispatch(fetchSettings())
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingForm);
