import React from 'react';
import { roleService } from 'services/RoleService.js';
import { Button, Card, Spin } from "antd";
import RoleProfile from "./components/RoleProfile";
import SystemContext from 'context/SystemContext';

class Role extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: {}
        };
    }
    
    componentDidMount() {
        this.getExistingItem();
    }

    getExistingItem = () => {

        let { id } = this.props.match.params;
        
        // if id doesn't exist
        if(id === undefined) {
            this.setState({                
                loading: false                
            });
            return;            
        }

        // if new item
        this.setState({
            id: id
        });

        // get existing
        this.setState ({
            loading: true
        });

        roleService.getById(id)
            .then(data => {
                this.setState ({
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                this.props.history.push('/manage/security/roles');
            })
            .finally(() => {
                this.setState ({
                    loading: false
                });
            })
    }


    render() {

        if(this.state.loading) {
            return (
                <Card title="Role">
                    <Spin size="large" />
                </Card>
            )
        }
        else {
            return (
                <Card title="Role"
                    extra={ <span><Button color="btn btn-light" onClick={() => this.props.history.push('/manage/security/roles')} title="View All Roles">View All Roles</Button></span> }
                >
                    <RoleProfile data={this.state.data} />
                </Card>
            )
        }
        
    }
}

Role.contextType = SystemContext;
export default Role;