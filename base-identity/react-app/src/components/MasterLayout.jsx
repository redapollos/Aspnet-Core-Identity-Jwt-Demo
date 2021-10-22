import React from "react";
import {
    LogoutOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Avatar, Drawer } from "antd";
import { NavLink } from "react-router-dom";
import SystemContext from 'context/SystemContext';
import SiteMenu from './SiteMenu';

const { Content, Header, Sider } = Layout;

class MasterLayout extends React.Component {    
    constructor(props) {
        super(props);
        
        this.state = {
            collapsed: false,
            drawerVisible: false
        };
    }

    toggle = () => {
        if(window.innerWidth >= 992)
            this.setState({
                collapsed: !this.state.collapsed
            });
        else
            this.setState({
                drawerVisible: !this.state.drawerVisible
            });
    };

    userSignOut = (e) => {
        this.context.logout()
        window.location.href = "/";
        e.preventDefault();
        return false;
    }

    render() {

        let userMenu = (
            <Menu>
                <Menu.Item>         
                    <a className="dropdown-item text-muted" href="/" onClick={this.userSignOut}>      
                        <LogoutOutlined className="mr-1" />
                        Logout
                    </a>
                </Menu.Item>      
            </Menu>
        )

        let thumbnail = <Avatar size={50} icon={<UserOutlined />} class="light" />

        return (
            <Layout className="wrapper">
                <Drawer
                    title={ <NavLink to={"/"} className="navbar-logo-container">
                            Put Logo Here
                        </NavLink>}
                    placement="left"
                    closable={false}
                    getContainer={false}
                    onClose={this.toggle}
                    visible={this.state.drawerVisible}>
                    <SiteMenu />
                </Drawer>

                <Sider 
                    trigger={null} 
                    collapsible 
                    collapsed={this.state.collapsed} 
                    collapsedWidth="0"
                    breakpoint="lg"
                    className="side-nav"
                    onBreakpoint={broken => {
                        this.setState({ collapsed: broken });
                    }}>

                    <SiteMenu />

                </Sider>
                
                <Layout>
                    <Header className="navbar">
                        <NavLink to={"/"} className="navbar-logo-container">
                            Logo Here
                        </NavLink>


                        <span
                            className="trigger"                            
                            onClick={this.toggle}
                        >
                        {
                            this.state.collapsed &&
                                <MenuUnfoldOutlined className="anticon-menu" />
                        }
                        {
                            !this.state.collapsed &&
                                <MenuFoldOutlined className="anticon-menu" />
                        }
                        </span>

                        <div className="ml-auto mr-0">                            
                            <Dropdown
                                trigger={['click']}
                                overlay={userMenu}>
                                {thumbnail}
                            </Dropdown>
                        </div>

                    </Header>
                    <Content className="container">
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    };
}

MasterLayout.contextType = SystemContext;
export default MasterLayout;