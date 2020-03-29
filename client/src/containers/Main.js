import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Start, Settings, BuildHistory, BuildDetails } from 'pages';
import {fetchSettings} from '../actions/settings';

const Main = ({settings, getSettings}) => {

    useEffect(() => {
        if (!settings.id) {
            getSettings();
        }
    }, []);

    return (
        <React.Fragment>
            <Switch>
                <Route exact path='/' component={Start}/>
                <Route exact path='/settings' component={Settings}/>
                <Route exact path='/build/:id' component={BuildDetails}/>
            </Switch>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    settings: state.settings
});
  
const mapDispatchToProps = dispatch => ({
    getSettings: () => dispatch(fetchSettings())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);