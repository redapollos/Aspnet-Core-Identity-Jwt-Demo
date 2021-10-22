import React, {Component} from 'react';
import { Form, Input, Button } from 'antd';
import UserSettingsContext from '../context/UserSettingsContext';

class UserProfileInfo extends Component {    
    formRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            id: ""
        };
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.id === this.context.user.id)
            return;

        this.load();        
    }

    load = () => {
        
        // set the state so we don't have an endless loop
        this.setState({ 
            id: this.context.user.id,
            thumbnailUrl: this.context.user.thumbnailUrl
        });

        // prepopulate the form
        this.formRef.current.setFieldsValue({
            userName: this.context.user.userName,
            firstName: this.context.user.firstName,
            lastName: this.context.user.lastName,
            email: this.context.user.email,
            phoneNumber: this.context.user.phoneNumber
        });
    }


    handleFinish = values => {        
        this.context.updateUserProfile(values);
    }

    render() {

        return (
            <div>

                <Form ref={this.formRef} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} onFinish={this.handleFinish}>

                    <Form.Item 
                        label="Username"
                        name="userName"
                        rules={[{ required: false, message: 'Please enter a username' }]}
                    >
                        <Input placeholder="username" />
                    </Form.Item>

                    <Form.Item 
                        label="First"
                        name="firstName"
                        rules={[{ required: false, message: 'Please enter a first name' }]}
                    >
                        <Input placeholder="first name" />
                    </Form.Item>

                    <Form.Item 
                        label="Last"
                        name="lastName"
                        rules={[{ required: false, message: 'Please enter a last name' }]}
                    >
                        <Input placeholder="last name" />
                    </Form.Item>

                    <Form.Item 
                        label="Email"
                        name="email"
                        rules={[
                                { type: 'email',  message: 'Please enter a valid email address' },
                                { required: true, message: 'Please enter an email address' }
                            ]}
                    >
                        <Input placeholder="email" />
                    </Form.Item>

                    <Form.Item 
                        label="Phone"
                        name="phoneNumber"
                    >
                        <Input placeholder="phone" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                        <Button type="primary" htmlType="submit" loading={this.context.loading}>Submit</Button>
                    </Form.Item>

                </Form>

            </div>
        )
    }
}

UserProfileInfo.contextType = UserSettingsContext;
export default UserProfileInfo;