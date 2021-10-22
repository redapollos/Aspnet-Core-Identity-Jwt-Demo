import React from 'react';
import { NavLink } from 'react-router-dom';
import Layout from 'components/SimpleLayout';
import { Form, Button, Input, Typography, Alert, Card } from "antd";
import { authenticationService } from 'services/AuthenticationService';
import SystemContext from 'context/SystemContext';
import qs from 'qs';
import { notify } from 'util/Notify';

const { Title } = Typography;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            errorMsg: "",
            display: "login"
        }
    }

    componentWillMount() {        
        let q = qs.parse(window.location.search.replace("?", ""))

        // forward after login
        if(q.to !== undefined && q.to.length > 0)
        {
            localStorage.setItem('redirect_url', q.to);            
        }

        // remove a forward if it was just logged off
        if(q.logoff !== undefined && localStorage.getItem("redirect_url")) {
            localStorage.removeItem('redirect_url');
        }
    }

    handleFinish = values => {        
        this.loginUser(values);
    }

    handleRegister = (values) => {
        this.loginUser(values);
    }
    
    handlePasswordReminder = values => {

        this.context.setLoading(true);

        authenticationService.resetPassword(values.email)
            .then(data => {
                notify.success("Check your email.");

                this.setState({
                    display: "login",
                    showError: false
                });
            })
            .catch(err => {
                this.setState({
                    showError: true,
                    errorMsg: err
                });
            })
            .finally(() => {                        
                this.context.setLoading(false);
            });
    }

    loginUser = (values) => {

        this.context.setLoading(true);

        authenticationService.login(values)
            .then(data => {
                this.handleLogin(data);
            })
            .catch(err => {
                // console.log(err);
                this.setState({
                    showError: true,
                    errorMsg: err
                });
                this.context.setLoading(false);
            }); 
    }

    handleLogin = (data) => {
        this.context.setLoading(true);
        this.context.setUser(data);
        
        let to = "/";
        if(localStorage.getItem("redirect_url")) {
            to = localStorage.getItem("redirect_url");
            localStorage.removeItem("redirect_url");
        }
        
        // if no sub/app, then they go to nosub
        if(this.context.appId === null)
            to = "/nosub";

        window.location.href = to; // go home or wherever directed to
    }


    render() {

        return (
            <Layout>

                {
                    this.state.showError && 
                        <Alert
                            message="Login Error"
                            description={this.state.errorMsg}
                            type="error"
                            className="mx-auto w-30 mb-3"
                            showIcon
                        />
                }                
                
                <Card className="login-container">
                {
                    this.state.display === "login" && 
                        <div>
                            <Title>Login</Title>
                            <Form onFinish={this.handleFinish} style={{ width: "100%" }}>

                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Enter a username' }]}
                                >
                                    <Input placeholder="username" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Enter a password' }]}
                                >
                                    <Input placeholder="password" type="password" />
                                </Form.Item>
                                
                                <div className="reset-password text-right mt-3 mb-3">
                                    <span className="pointer" onClick={() => this.setState({ display: "password"})}>Forgot Password</span>
                                </div>
                                
                                <div className="button-row mt-2 mb-3 text-center">
                                    <Button type="primary" htmlType="submit" className="btn-login" loading={this.context.loading}>
                                        Login
                                    </Button>
                                </div>
                            </Form>

                            <div className="text-center">
                                <Typography.Text type="secondary">Don't have an account yet? &nbsp;</Typography.Text>
                                <NavLink to="/register" className="ant-btn">Sign Up</NavLink>
                            </div>

                        </div>
                }

                {
                    this.state.display === "password" &&
                    <div>
                        <Title>Password Reset</Title>
                        <Form onFinish={this.handlePasswordReminder} style={{ width: "100%" }}>

                            <Form.Item
                                name="email"
                                rules={[{ type: 'email', message: 'Enter a Valid Email'},{ required: true, message: 'Enter an email' }]}
                            >
                                <Input placeholder="email" />
                            </Form.Item>

                            <div className="button-row mt-2">
                                <Button type="primary" htmlType="submit" block>
                                    Reset Password
                                </Button>
                            </div>
                            
                            <div className="reset-password text-right mt-3">
                                <span className="pointer" onClick={() => this.setState({ display: "login" })}>Back to Login</span>
                            </div>
                        </Form>
                    </div>
                }
                </Card>
            </Layout>
        );
    }
}

Login.contextType = SystemContext;
export default Login;