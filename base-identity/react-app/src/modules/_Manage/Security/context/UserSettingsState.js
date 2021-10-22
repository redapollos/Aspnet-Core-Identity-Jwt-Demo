import React from 'react';
import UserSettingsContext from './UserSettingsContext';
import SystemContext from 'context/SystemContext';
import { contactService } from 'services/ContactService';
import { userService } from 'services/UserService';
import { roleService } from 'services/RoleService.js';
import { notify } from 'util/Notify';


class UserSettingsState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},            
            roles: [],
            properties: [],            
            loading: true,
            allRoles: [],
            subscription: null
        };
    }

    setLoading = (boo) => {
        this.setState({ loading: boo });
    }

    loadUser = (id) => {
        this.setLoading(true);

        userService.getById(id)
            .then(data => {

                this.setState ({
                    user: data
                });
            })
            .catch(err => {
                notify.error("Can't load the user");    
            })
            .finally(() => {                
                this.setLoading(false);
            });
    }

    updateUserProfile = (values) => {
        this.setLoading(true);
        
        values.id = this.state.user.id;

        userService.post(values)
            .then(data => {                                                
                // show a woo-hoo
                notify.success('Your profile has been updated');

                if(data.id !== undefined)
                    this.setState({
                        user: data
                    });
            })
            .catch(err => {
                notify.error(err);                     
            })
            .finally(() => {
                this.setLoading(false);
            });
    }

    updateUserPassword = (values) => {
        this.setLoading(true);
        
        values.id = this.state.user.id;

        userService.updatePassword(values)
            .then(data => {                                                
                // show a woo-hoo
                notify.success('You have successfully updated the password');
            })
            .catch(err => {
                notify.error(err);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }

    loadRoles = () => {
        this.setLoading(true);

        Promise.all([
            userService.getUserRoles(this.state.user.id),
            roleService.get()
        ])
        .then(response => {
            this.setState ({
                roles: response[0],
                allRoles: response[1]
            });
        })
        .catch(err => console.log(err))
        .finally(() => {                
            this.setLoading(false);
        })
    }

    deleteRole = (roleid) => {
        
        this.setLoading(true);
        userService.deleteRoleFromUser(this.state.user.id, roleid)
        .then(data => {
            notify.success('The role has been removed');
            
            // splice out the deleted object
            var idx = this.state.roles.findIndex(o => o.roleId === roleid);                
            if(idx > -1) {
                let list = [...this.state.roles];
                list.splice(idx, 1);
                this.setState({
                    roles: list
                });
            }
            
        })
        .catch(err => {
            notify.error(err);  
        })
        .finally(() => {
            this.setLoading(false);
        });
    }

    loadProperties = () => {
        this.setLoading(true);
        
        userService.getProperties(this.state.user.id)
            .then(data => {                                                                
                this.setState({
                    properties: data
                });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }

    saveProperties = (values) => {
        this.setLoading(true);
        
        contactService.postProperties(this.state.user.contactId, values)
            .then(data => {
                notify.success('The properties have been updated');
            })
            .catch(err => {
                notify.error(err);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }

    deleteUser = () => {
        this.setLoading(true);
        
        userService.deleteUser(this.state.user.id)
            .then(data => {      
                // if the id is a different contact than who is logged in, log them out
                let info = localStorage.getItem('user_info') && JSON.parse(window.atob(localStorage.getItem('user_info')));
                if(info !== null) {
                    if(info.id === this.state.user.id)
                        this.logout();
                    else {                 
                        notify.success('The user has been deleted');                               

                        let u = this.state.user;
                        u.isDeleted = true;
                        this.setState({ user: u });
                    }
                }                
                
            })
            .catch(err => {
                notify.error(err);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }

    restoreUser = () => {
        userService.restoreUser(this.state.user.id)
            .then(data => {               
                notify.success('The user has been restored'); 

                let u = this.state.user;
                u.isDeleted = false;
                this.setState({ user: u });
                
            })
            .catch(err => {
                notify.error(err);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }
    
    logout = () => {
        console.log('logging out');
        localStorage.removeItem("user_info");        
        window.location.href = "/";
    }

    //#region subscriptions
    loadSubscription = () => {
        // don't reload if we already have the data
        if(this.state.subscription)
            return;

        // user the state sub if present
        if(this.state.user.subscriptionHighlights.length === 0)
            return;

        // see if the current sub matches any of their subs, if so, show that
        let subId = this.state.user.subscriptionHighlights.find(o => o.id === this.context.subscriptionId)?.id ?? this.state.user.subscriptionHighlights[0].id;
        
        // load the current subscription
        this.setLoading(true);
        userService.getSubscription(subId) 
            .then(res => {
                console.log(res);
                this.setState({ subscription: res });
            })
            .catch(err => {
                notify.error(err);
            })
            .finally(() => {
                this.setLoading(false);
            });
    }
    //#endregion

    render() {
        return (
            <UserSettingsContext.Provider
              value={{
                user: this.state.user,
                repos: this.state.repos,
                properties: this.state.properties,
                roles: this.state.roles,
                allRoles: this.state.allRoles,
                loading: this.state.loading,
                subscription: this.state.subscription,
                setLoading: this.setLoading,
                loadUser: this.loadUser,
                updateUserProfile: this.updateUserProfile,
                updateUserPassword: this.updateUserPassword,
                loadRoles: this.loadRoles,
                deleteRole: this.deleteRole,
                loadProperties: this.loadProperties,
                saveProperties: this.saveProperties,
                deleteUser: this.deleteUser,
                restoreUser: this.restoreUser,
                loadSubscription: this.loadSubscription
              }}
            >
              {this.props.children}
            </UserSettingsContext.Provider>
          );
    }  
};

UserSettingsState.contextType = SystemContext;
export default UserSettingsState;
