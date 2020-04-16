import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Header, Layout, Button, Icon, BuildList, NewBuild } from 'components';
import {addBuild} from 'actions/builds';


const BuildHistory = () => {
    const settings = useSelector(state => state.settings);
    const addBuildPending = useSelector(state => state.builds.add_build_pending);
    const addBuildError = useSelector(state => state.builds.add_build_error);

    const dispatch = useDispatch();
    const runBuild = (hash) => dispatch(addBuild(hash));

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (addBuildPending == false && !addBuildError) {
            setOpenModal(false);
        }
    }, [addBuildPending]);

    const openModalHandler = () => {
        setOpenModal(true);
    }

    const closeModalhandler = () => {
        setOpenModal(false);
    }

    return (
        <React.Fragment>
            <Header title={settings.repoName}>
                <div className="header__button-group">
                    <Button className="button_type_icon-text" size="s" onClick={openModalHandler}>
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
            <NewBuild open={openModal} onClose={closeModalhandler} onRunBuild={runBuild} pending={addBuildPending}/>
        </React.Fragment>
    );
}

export default BuildHistory;
