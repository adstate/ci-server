import React from 'react';
import { Header, Layout, SettingForm } from 'components';


const Settings = () => {

    return (
        <React.Fragment>
            <Header title="School CI Server"></Header>
            <Layout container>
                <SettingForm/>
            </Layout>
        </React.Fragment>
    );
}


export default Settings;