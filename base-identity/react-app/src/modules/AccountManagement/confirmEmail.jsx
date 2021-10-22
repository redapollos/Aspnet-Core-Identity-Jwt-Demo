import React from 'react';
import Layout from 'components/SimpleLayout';
import { Spin, Alert, Card } from "antd";
import { NavLink } from "react-router-dom";
import { authenticationService } from 'services/AuthenticationService';
import qs from 'qs';
import SystemContext from 'context/SystemContext';

class ConfirmEmail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            errorMsg: ""
        }
    }

    componentDidMount = () => {
        const q = qs.parse(window.location.search.replace("?", ""))

        // make sure the needed values exist
        if(q.u === undefined || q.e === undefined) {
            this.props.history.push("/");
            return;
        }            

        this.context.setLoading(true);
 
        let data = {
            userId: q.u,
            emailToken: q.e
        }
        
        // try to confirm the email address
        authenticationService.confirmEmail(data)
            .then(data => {                
                this.context.setUser(data);
                window.location.href = "/"; // go home
            })
            .catch(err => {
                // console.log(err);
                this.setState({
                    showError: true,
                    errorMsg: "There was an error with token."
                });                
            })
            .finally(() => {
                this.context.setLoading(false);
            });
    }

    render() {

        return (
            <Layout>                

                <Card className="login-container">
                    <div className="mb-5 text-center">
                        <NavLink to={"/"} className="navbar-logo-container">
                            <img src="/assets/images/logo.png" className="img-fluid w-70 mb-5" alt="MerchRebate" />
                        </NavLink>
                        <br /><br />
        
                        {
                            this.context.loading && <Spin size="large" />
                        }

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
                    </div>
                </Card>
            </Layout>
        );
    }
}

ConfirmEmail.contextType = SystemContext;
export default ConfirmEmail;