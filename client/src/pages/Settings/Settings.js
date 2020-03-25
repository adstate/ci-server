import React from 'react';
import { Button, Layout } from 'components';


const Settings = () => {

    return (
        <Layout container>
            <div className="section">
                <div className="layout__container">
                    <form className="setting-form form">
                        <div className="form__header">
                            <div className="form__title">Settings</div>
                            <div className="form__subtitle">Configure repository connection and synchronization settings.</div>
                        </div>

                        <div className="form__item form__control form__control_required">
                            <div className="form__label">GitHub repository</div>
                            <div className="form-field">
                                <input type="text" className="form-field__input" placeholder="user-name/repo-name"/>
                                <div className="icon icon_size_s icon_type_clear form-field__icon"></div>

                            </div>
                        </div>

                        <div className="form__item form__control">
                            <div className="form__label">Build command</div>
                            <div className="form-field">
                                <input type="text" className="form-field__input" placeholder="npm run ..." defaultValue="npm ci && npm run build"/>
                                <div className="icon icon_size_s icon_type_clear form-field__icon"></div>
                            </div>
                        </div>

                        <div className="form__item form__control">
                            <div className="form__label">Main branch</div>
                            <div className="form-field">
                                <input type="text" className="form-field__input" placeholder="branch for build" defaultValue="master |"/>
                                <div className="icon icon_size_s icon_type_clear form-field__icon"></div>
                            </div>
                        </div>

                        <div className="form__item form__item_direction_left form__control">
                            <div className="form__label">Synchronize every</div>
                            <div className="form-field form-field_size_s">
                                <input type="text" className="form-field__input form-field__input_type_number" placeholder="" defaultValue="10"/>
                            </div>
                            <div className="form__control-postfix">minutes</div>
                        </div>

                        <div className="setting-form__footer form__footer form__item form__item_direction_left">
                            <Button className="setting-form__button setting-form__submit" variant="action" size="m">Save</Button>
                            <button type="reset" className="button button_default button_size_m setting-form__button">Candel</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}



export default Settings;