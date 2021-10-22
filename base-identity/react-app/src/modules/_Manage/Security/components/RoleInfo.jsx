import React from 'react';
import { withRouter } from 'react-router-dom';
import { roleService } from 'services/RoleService.js';
import { Form, Button, Card, Input } from "antd";
import SystemContext from 'context/SystemContext';
import { notify } from 'util/Notify';


class RoleInfo extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: []
        };
    }
    
    componentDidMount() {
        // prepopulate the form
        this.formRef.current.setFieldsValue({
            name: this.props.data.name
        })
    }


    handleFinish = (values) => {

        // create the object
        values.id = this.props.data.id;
        let canRedirect = false;
        
        this.setState({
            loading: true
        });
        
        roleService.post(values)
            .then(data => {                                                
                // show a woo-hoo
                notify.success('Your role has been updated');
                
                canRedirect = true;
            })
            .catch(err => {
                notify.error(err);       
            })
            .finally(() => {
                this.setState({
                    loading: false
                }, () => {
                    // go back to the list
                    if(canRedirect)
                        this.props.history.push("/manage/security/roles");     
                });
            }); 
    }


    render() {

        return (
            <Card title="Role">

                <Form ref={this.formRef} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} onFinish={this.handleFinish}>

                    <Form.Item 
                        label="Role Name"
                        name="name"
                        rules={[{ required: false, message: 'Please give your role a name' }]}
                    >
                        <Input placeholder="role name" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>Submit</Button>
                    </Form.Item>

                </Form>

            </Card>
        )
    }
}

RoleInfo.contextType = SystemContext;
export default withRouter(RoleInfo);