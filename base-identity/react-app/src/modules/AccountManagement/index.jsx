import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from 'components/MasterLayout';
import User from './user';

const AcctManagement = (props) => {
    const { match } = props; 

    return (
        <Layout>
            <Switch>
                <Route exact path={`${match.url}/user`} component={User} />
                <Route component={User} />
            </Switch>
        </Layout>
    );
};

export default {
    routeProps: {
        path: '/accountmanagement',
        component: AcctManagement
    },
    name: 'AccountManagement',
    manage: true
}