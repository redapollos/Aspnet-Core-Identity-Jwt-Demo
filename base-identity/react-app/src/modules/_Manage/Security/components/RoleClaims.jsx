import React from 'react';
import { roleService } from 'services/RoleService.js';
import { Form, Button, Card, Alert, Checkbox } from "antd";
import SystemContext from 'context/SystemContext';
import { notify } from 'util/Notify';

class RoleClaims extends React.Component {    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            claims: [],
            selected: this.props.data.claims.map((o, idx) => { return o.value })
        };
    }

    
    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState ({ loading: true });

        roleService.getClaims()
            .then(data => {
                this.setState ({
                    claims: data
                });
            })
            .catch(err => {
                console.log(err);
                this.props.history.push('/manage/roles');
            })
            .finally(() => {                
                this.setState ({
                    loading: false
                });
            })
    }
    
    onChange = selected => {
        this.setState({
            selected,
        });
    };

    handleSubmit = () => {
        this.setState ({ loading: true });


        roleService.updateClaims(this.props.data.id, this.state.selected)
            .then(data => {
                notify.success('Permissions have been updated');
            })
            .catch(err => {
                notify.error(err);
            })
            .finally(() => {                
                this.setState ({
                    loading: false
                });
            })
    }


    render() {

        if(this.props.data.normalizedName === "ADMINISTRATOR") {
            return (
                <Alert
                    message="The Administrator Role"
                    description="This role gets all permissions."
                    type="info"
                    className="mx-auto w-30 mb-3"
                    showIcon
                />
            )
        }
        else {
            return (
                <Card title="Permissions">
                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 14 }}>

                        <Form.Item label="Permissions">
                            <Checkbox.Group onChange={this.onChange} value={this.state.selected} className="p-2">
                            {
                                this.state.claims.map((o, idx) => {
                                    return <span key={idx}><Checkbox value={o.value}>{o.label}</Checkbox><br /></span>
                                })
                            }
                            </Checkbox.Group>
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                            <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>Submit</Button>
                        </Form.Item>

                    </Form>
                </Card>
            )
        }

        
    }
}

RoleClaims.contextType = SystemContext;
export default RoleClaims;