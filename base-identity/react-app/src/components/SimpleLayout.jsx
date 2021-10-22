import React from "react";
import { Layout } from "antd";
import { NavLink } from "react-router-dom";
const { Content, Header } = Layout;

class SimpleLayout extends React.Component {

    render() {
        return (
            <Layout className="wrapper-simple">
                <Layout>
                    <Header className="navbar">
                        <NavLink to={"/"} className="navbar-logo-container">
                            Logo Goes Here
                        </NavLink>
                    </Header>
                    <Content className="container container-full">
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>

        )
    };
}

export default SimpleLayout;