import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Start, Settings, BuildDetails } from 'pages';
import {fetchSettings} from '../actions/settings';
import {RootState} from 'reducers';


const Main: React.FC = () => {
    const settings = useSelector((state: RootState) => state.settings);
    const dispatch = useDispatch();
    
    const getSettings = () => {
        dispatch(fetchSettings());
    }

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

export default Main;
