import React, { Component } from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from 'util/AsyncComponent';
import SystemContext from 'context/SystemContext';
import Home from './modules/Home';
import Dashboard from './modules/Dashboard';
import NoSub from './modules/AccountManagement/noSub';
import Login from './modules/AccountManagement/login';
import Register from './modules/AccountManagement/register';
import ConfirmEmail from './modules/AccountManagement/confirmEmail';
import ConfirmPassword from './modules/AccountManagement/confirmPassword';

const RestrictedRoute = ({component: Component, authUser, ...rest}) =>
    <Route
        {...rest}
        render={props =>
            authUser
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/login',
                        state: {from: props.location}
                    }}
                />}
    />;

class App extends Component {    
    static contextType = SystemContext;
 
    componentWillMount() {
        // per environment, then add class to change the bg color
        if(window.location.href.indexOf("localhost") > -1)
            document.getElementById("root").className += " root-dev";
        if(window.location.href.indexOf("staging") > -1)
            document.getElementById("root").className += " root-staging";
    }

    render() {
        // get authUser from localStorage
        let authUser = this.context.getUser();

        const {match, location} = this.props;

        // forward to the landing page
        if (location.pathname === '/') {
            if (authUser === null) {                
                return ( <Redirect to={'/login'}/> );                                        
            } else {
                return ( <Redirect to={'/home'}/> );
            }
        }
        
        return (            
            
            <div id="app-main" className="app-main">
                <Switch>
                    <Route path={`${match.url}login`} component={Login}/>
                    <Route path={`${match.url}register`} component={Register}/>
                    <Route path={`${match.url}confirmemail`} component={ConfirmEmail}/>
                    <Route path={`${match.url}confirmpassword`} component={ConfirmPassword}/>
                    <Route path={`${match.url}nosub`} component={NoSub}/>                 
                    
                    <RestrictedRoute authUser={authUser} path={`${match.url}home`} component={Home}/>
                    <RestrictedRoute authUser={authUser} path={`${match.url}dashboard`} component={Dashboard}/>
                    <Route component={asyncComponent(() => import('modules/Misc/404'))} />
                </Switch>                    
            </div>
            
        );
    }
}

export default App;