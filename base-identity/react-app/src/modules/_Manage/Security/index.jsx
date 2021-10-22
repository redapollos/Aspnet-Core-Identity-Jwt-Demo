import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from 'components/MasterLayout';
import UserList from './userList';
import User from './user';
import RoleList from './roleList';
import Role from './role';

const Security = (props) => {
    const { match } = props; 

    return (
        <Layout>
            <Switch>
                <Route exact path={`${match.url}/users/:roleid?`} component={UserList} />
                <Route exact path={`${match.url}/user/:id?`} component={User} />
                <Route exact path={`${match.url}/roles`} component={RoleList} />
                <Route exact path={`${match.url}/role/:id?`} component={Role} />
                <Route component={UserList} />
            </Switch>
        </Layout>
    );
}; 

export default {
    routeProps: {
        path: '/manage/security',
        component: Security
    },
    name: 'Security',
    manage: true
}