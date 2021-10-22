import React, {Component} from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Card, Button, Popconfirm } from 'antd';
import UserProfileInfo from './UserProfileInfo';
import UserPassword from './UserPassword';
import UserRoles from './UserRoles';
import UserSettingsContext from '../context/UserSettingsContext';
import moment from "moment";

const { TabPane } = Tabs;

class UserProfile extends Component {
    static contextType = UserSettingsContext;
    
    componentDidMount() {
        this.getExistingItem();
    }

    getExistingItem = () => {

        let { id } = this.props.match.params;
        
        // if id doesn't exist, use current user
        if(id === undefined) {
            if(this.props.id === undefined) // or leave if not given
                this.props.history.push('/');
            id = this.props.id;
        }

        // load up the user
        this.context.loadUser(id);
    }

    render() {

        let defTab = 1; 
        switch(window.location.hash) {
            case "#info": defTab = 1; break;
            case "#password": defTab = 2; break;
            case "#roles": defTab = 3; break;
            default: defTab = 1;
        }
        
        let title = this.props.isAdmin ? "Manage User" : "Edit Your Profile";
        let extra = this.props.isAdmin ? <span><Button color="btn btn-light" onClick={() => this.props.history.push('/manage/security')} title="View All Users">View All Users</Button></span> : "" ;

        return (
            <Card
                title={title}
                extra={extra}
            >
                <div>
                    <Row gutter={[16,16]}>
                        <Col span={2}>
                            <img src={this.context.user.thumbnailUrl} alt={this.context.user.fullName} className="w-100" />
                        </Col>
                        <Col span={20}>
                            <h2 className="mb-0">{this.context.user.firstName} {this.context.user.lastName}</h2>
                            <p className="mb-0">
                                <small>
                                    <em>created: {moment(this.context.user.createdOn).format("LL")}</em><br />
                                    <em>last login: {moment(this.context.user.lastLoginOn).format("LL")}</em>
                                </small>
                            </p>
                        </Col>
                        <Col span={2} className="text-right">
                            {
                                !this.context.user.isDeleted && 
                                    <Popconfirm
                                        title={this.props.isAdmin ? "Are you sure you want to delete this user?" : "Are you sure you want to remove your account?" }
                                        onConfirm={() => this.context.deleteUser()}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" danger><DeleteOutlined /></Button>
                                    </Popconfirm>
                            }
                            {
                                this.context.user.isDeleted && 
                                    <Popconfirm
                                        title="Are you sure you want to restore this user?"
                                        onConfirm={() => this.context.restoreUser()}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="secondary" danger>Restore</Button>
                                    </Popconfirm>
                            }                            
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            
                            <Tabs defaultActiveKey={defTab.toString()}>
                                <TabPane tab="Profile" key="1">                        
                                    <UserProfileInfo />                             
                                </TabPane>

                                <TabPane tab="Password" key="2">
                                    <UserPassword />
                                </TabPane>

                                { // admins only for roles
                                    this.props.isAdmin && 
                                        <TabPane tab="Roles" key="3">
                                            <UserRoles />
                                        </TabPane>
                                }
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }
};

export default UserProfile;