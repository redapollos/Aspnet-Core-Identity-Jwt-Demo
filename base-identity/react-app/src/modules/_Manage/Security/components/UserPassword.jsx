import React, {Component} from 'react';
import { Form, Button, Input } from 'antd';
import UserSettingsContext from '../context/UserSettingsContext';


class UserPassword extends Component {
    static contextType = UserSettingsContext;
    formRef = React.createRef();
        
    handleFinish = values => {        
        this.context.updateUserPassword(values);   
    }

    handleFinishFailed = e => {
        console.log('Failed:', e)
    }


    render() {

        return (
            <div>
                
                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} onFinish={this.handleFinish} onFinishFailed={this.handleFinishFailed}>

                    <Form.Item 
                        label="New Password"
                        name="password"
                        rules={[
                                { required: true, message: 'Please enter a new password' }
                            ]}
                    >
                            <Input.Password placeholder="password" />
                    </Form.Item>

                    <Form.Item 
                        label="Confirm Password"
                        name="confirm"
                        rules={[
                                { required: true, message: 'Enter your new password again' },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The passwords do not match!');
                                    }
                                })
                            ]}
                    >
                        <Input.Password placeholder="confirm password" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                        <Button type="primary" htmlType="submit" loading={this.context.loading}>Submit</Button>
                    </Form.Item>
                </Form>
                    
            </div>
        )
    }

}

export default UserPassword;