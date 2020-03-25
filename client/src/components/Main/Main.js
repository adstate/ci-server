import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Start, Settings } from 'pages';


const Main = () => {

    return (
        <React.Fragment>
            <Switch>
                <Route exact path='/' component={Start}/>
                <Route exact path='/settings' component={Settings}/>
            </Switch>
        </React.Fragment>
    )
}

export default Main;