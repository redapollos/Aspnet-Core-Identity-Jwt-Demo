import React from 'react';
import UserProfile from "./components/UserProfile";
import UserSettingsState from './context/UserSettingsState';

class User extends React.Component {
    
    render() {
        
        return (
            <UserSettingsState>
                <UserProfile {...this.props} isAdmin={true} />                
            </UserSettingsState>
        );
    }
}

export default User;