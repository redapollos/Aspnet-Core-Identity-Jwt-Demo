import React from 'react';
import { NavLink } from 'react-router-dom';
import Layout from 'components/SimpleLayout';
import { Typography, Card } from "antd";
import SystemContext from 'context/SystemContext';
import RegisterUser from './components/RegisterUser';
import { authenticationService } from 'services/AuthenticationService';
import qs from 'qs';

const { Title } = Typography;

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            errorMsg: ""
        }
    }    

    componentWillMount() {        
        let q = qs.parse(window.location.search.replace("?", ""))

        // forward after login
        if(q.to !== undefined && q.to.length > 0)
        {
            localStorage.setItem('redirect_url', q.to);
        }
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
        
        window.location.href = to; // go home or wherever directed to
    }

    render() {

        return (
            <Layout>
                <Card className="login-container">
                    
                    <Title>Register</Title>

                    <RegisterUser 
                        onSuccess={this.loginUser}
                        showTerms={true} />
                        
                    <div className="reset-password text-right mt-3">
                        <NavLink to="/login" className="ant-btn">Back to Login</NavLink>
                    </div>
                    
            
                </Card>                
            </Layout>
        );
    }
}

Register.contextType = SystemContext;
export default Register;