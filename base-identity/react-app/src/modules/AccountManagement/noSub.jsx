import React from 'react';
import Layout from 'components/SimpleLayout';
import { Typography, Alert, Card } from "antd";
import SystemContext from 'context/SystemContext';

const { Title } = Typography;

class NoSub extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showError: true,
            errorMsg: "You don't have an active subscription."
        }
    }
    
    userSignOut = (e) => {
        this.context.logout()
        window.location.href = "/";
        e.preventDefault();
        return false;
    }

    render() {

        return (
            <Layout>

                {
                    this.state.showError && 
                        <Alert
                            message="Error"
                            description={this.state.errorMsg}
                            type="error"
                            className="mx-auto w-30 mb-3"
                            showIcon
                        />
                }                
                
                <Card className="login-container">
                
                        <div class="text-center">
                            <Title>No Subscription</Title>
                            
                            <div className="text-center">
                                <Typography.Text type="secondary">Please contact your system administrator.</Typography.Text>
                                <br /><br />
                                <a href="/" className="ant-btn" onClick={this.userSignOut}>Log out</a>
                            </div>
                        </div>
                </Card>
            </Layout>
        );
    }
}

NoSub.contextType = SystemContext;
export default NoSub;