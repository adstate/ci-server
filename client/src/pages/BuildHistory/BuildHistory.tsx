import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Header, Layout, Button, Icon, BuildList, NewBuild } from 'components';
import {addBuild} from 'actions/builds';
import {RootState} from 'reducers';


const BuildHistory: React.FC = () => {
    const settings = useSelector((state: RootState) => state.settings);
    const addBuildPending = useSelector((state: RootState) => state.builds.add_build_pending);
    const addBuildError = useSelector((state: RootState) => state.builds.add_build_error);

    const dispatch = useDispatch();
    const runBuild = (hash: string) => {
        dispatch(addBuild(hash));
    }

    const [openModal, setOpenModal] = useState<boolean>(false);

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
                        <Icon className="button__icon" type="play" size="xs"/>
                        <span className="button__text">Run build</span>
                    </Button>
                    <Button icon size="s" to="/settings">
                        <Icon className="button__icon" type="settings" size="xs"/>
                    </Button>
                </div>
            </Header>
            <Layout container>
                <BuildList/>
            </Layout>
            <NewBuild open={openModal} onClose={closeModalhandler} onRunBuild={runBuild} pending={!!addBuildPending}/>
        </React.Fragment>
    );
}

export default BuildHistory;
