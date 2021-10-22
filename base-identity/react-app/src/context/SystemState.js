import React from 'react';
import SystemContext from './SystemContext';
import { userService } from 'services/UserService';


class SystemState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},            
            roles: [],
            claims: [],
            loading: false,
            token: ""
        };
    }

    /// loads when page loads
    componentWillMount() {
        // if we have the localstorage info, then set the state using it        
        let info = localStorage.getItem('user_info') && JSON.parse(window.atob(localStorage.getItem('user_info')));
        if(info !== null)
            this.setSystemState(info);            

        // get system settings
        if(this.state.system === null) {
            this.getSystemSettings();
        }
    }

    /// sets the loading var for api processing
    setLoading = (boo) => {
        this.setState({ loading: boo });
    }

    /// accepts a user object and serializes it to localstorage
    setUser = (user) => {
        localStorage.setItem('user_info', window.btoa(JSON.stringify(user)));
        this.setSystemState(user);
    }

    /// sets various state vars for the site based on the user object
    setSystemState = (user) => {

        let roles = user.userRoles || [];
        let claims = user.claims || [];

        delete user.token;
        delete user.userRoles;
        delete user.claims;

        this.setState({
            roles,
            user,
            claims
        });
    }

    // Get User
    getUser = () => {
        try {            
            // if user is defined, then just return it
            if(this.state.user.id !== undefined) {                
                return this.state.user;
            }

            return null;
        }
        catch(err) {
            localStorage.removeItem('user_info');
            return null;
        }
    };

    logout = () => {
        console.log('logging out');
        localStorage.removeItem("user_info");
        this.setState({
            user: {},
            roles: [],
            claims: [],
            loading: false
        }, () => { window.location.href = "/login?logoff=1"; });
    }

    refreshUser = (callback) => {
        userService.getSelf(this.state.user.id)
            .then((data) => {

                // copy over the token so we don't lose it
                let token = this.getToken();
                data.token = token;

                // resave the new data
                this.setUser(data);

                // if there is a callback, run it
                if(callback)
                    callback();

                return data;
            })
            .catch(err => {
                return null;
            });
    }

    getToken = () => {
        // return authorization header with jwt token
        let info = localStorage.getItem('user_info');
        let user = info !== null ? JSON.parse(window.atob(info)) : null;
    
        if (user && user.token) {
            return user.token;
        } 
        return null;
    }

    render() {
        return (
            <SystemContext.Provider
              value={{
                user: this.state.user,
                roles: this.state.roles,
                loading: this.state.loading,
                token: this.state.token,

                setUser: this.setUser,
                getUser: this.getUser,
                refreshUser: this.refreshUser,
                setLoading: this.setLoading,
                getToken: this.getToken,
                logout: this.logout
              }}
            >
              {this.props.children}
            </SystemContext.Provider>
          );
    }  
};

export default SystemState;
