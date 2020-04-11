import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Layout, Configure, Header, Button, Icon } from 'components';

const Configuration = () => { 
    return (
        <React.Fragment>
            <Header title="School CI Server">
                <Link to="/settings">
                    <Button size="s">
                        <Icon className="button__icon" type="settings" size="xs"></Icon>
                        <span className="button__text">Settings</span>
                    </Button>
                </Link>
            </Header>
            <Layout align="center">
                <Configure/>
            </Layout>
        </React.Fragment>
    );
}

export default Configuration;
