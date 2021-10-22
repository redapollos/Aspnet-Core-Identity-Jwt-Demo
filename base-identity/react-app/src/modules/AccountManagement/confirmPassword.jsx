import React from 'react';
import Layout from 'components/SimpleLayout';
import { Form, Input, Button, Alert, Card } from "antd";
import { NavLink } from "react-router-dom";
import { authenticationService } from 'services/AuthenticationService';
import qs from 'qs';
import SystemContext from 'context/SystemContext';

class ConfirmPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            errorMsg: "",
            passwordToken: "",
            userid: ""
        }
    }

    componentDidMount = () => {
        const q = qs.parse(window.location.search.replace("?", ""))

        // make sure the needed values exist
        if(q.u === undefined || q.p === undefined) {
            this.props.history.push("/");
            return;
        }            

        this.setState({
            passwordToken: q.p,
            userid: q.u
        });
    }

    handleFinish = (values) => {

        this.context.setLoading(true);
 
        values.userId = this.state.userid;
        values.passwordToken = this.state.passwordToken;
                
        // try to confirm the email address && password
        authenticationService.confirmPassword(values)
            .then(data => {                
                this.context.setUser(data);
                window.location.href = "/"; // go home
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    showError: true,
                    errorMsg: err
                });                
            })
            .finally(() => {
                this.context.setLoading(false);
            });
    }

    render() {

        return (
            <Layout>                

                <Card className="simple-container">
                    <div className="mb-5 text-center">
                        <NavLink to={"/"} className="navbar-logo-container">
                            <img src="/assets/images/logo.png" className="img-fluid w-70 mb-5" alt="MerchRebate" />
                        </NavLink>
                        <br /><br />
        
                        {
                            this.state.showError && 
                                <Alert
                                    message="Error"
                                    description={this.state.errorMsg}
                                    type="error"
                                    className="mx-auto w-100 mb-3"
                                    showIcon
                                />
                        } 

                        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} onFinish={this.handleFinish} onFinishFailed={this.handleFinishFailed}>

                            <Form.Item 
                                label="New Password"
                                name="password"
                                rules={[
                                        { required: true, message: 'Please enter a password' }
                                    ]}
                            >
                                    <Input.Password placeholder="password" />
                            </Form.Item>

                            <Form.Item 
                                label="Confirm Password"
                                name="confirm"
                                rules={[
                                        { required: true, message: 'Enter your password again' },
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

                            <Form.Item wrapperCol={{ span: 14, offset: 10 }}>
                                <Button type="primary" htmlType="submit" loading={this.context.loading}>Submit</Button>
                            </Form.Item>
                        </Form>  
                    </div>
                </Card>
            </Layout>
        );
    }
}

ConfirmPassword.contextType = SystemContext;
export default ConfirmPassword;