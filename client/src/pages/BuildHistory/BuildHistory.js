import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Header, Layout, Button, Icon, BuildList, Modal, NewBuild } from 'components';


const BuildHistory = () => {
    const settings = useSelector(state => state.settings);

    const [openModal, setOpenModal] = useState(false);

    const runBuild = () => {
        setOpenModal(true);
    }

    return (
        <React.Fragment>
            <Header title={settings.repoName}>
                <div className="header__button-group">
                    <Button className="button_type_icon-text" size="s" onClick={runBuild}>
                        <Icon className="button__icon" type="play"/>
                        <span className="button__text">Run build</span>
                    </Button>
                    <Button icon size="s" to="/settings">
                        <Icon class="button__icon" type="settings" size="xs"/>
                    </Button>
                </div>
            </Header>
            <Layout container>
                <BuildList/>
            </Layout>
            <NewBuild open={openModal} onClose={() => setOpenModal(false)}/>
        </React.Fragment>
    );
}



export default BuildHistory;