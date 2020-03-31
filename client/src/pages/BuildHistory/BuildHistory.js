import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import { Header, Layout, Button, Icon, BuildList, NewBuild } from 'components';
import {addBuild} from 'actions/builds';


const BuildHistory = ({addBuildPending, runBuild}) => {
    const settings = useSelector(state => state.settings);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (addBuildPending === false) {
            setOpenModal(false);
        }
    }, [addBuildPending]);

    return (
        <React.Fragment>
            <Header title={settings.repoName}>
                <div className="header__button-group">
                    <Button className="button_type_icon-text" size="s" onClick={() => setOpenModal(true)}>
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
            <NewBuild open={openModal} onClose={() => setOpenModal(false)} onRunBuild={runBuild} pending={addBuildPending}/>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    addBuildPending: state.builds.add_build_pending
});
  
const mapDispatchToProps = dispatch => ({
    runBuild: (hash) => dispatch(addBuild(hash))
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuildHistory);