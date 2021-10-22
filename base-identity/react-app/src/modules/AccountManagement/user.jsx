import React from 'react';
import UserProfile from "modules/_Manage/Security/components/UserProfile";
import UserSettingsState from 'modules/_Manage/Security/context/UserSettingsState';
import SystemContext from 'context/SystemContext';

class User extends React.Component {
    static contextType = SystemContext;
    
    render() {        
        return (
            <UserSettingsState>
                <UserProfile {...this.props} 
                    id={this.context.user.id}
                    isAdmin={false} />
            </UserSettingsState>
        );
    }
}

export default User;