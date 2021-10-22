import React, {Component} from 'react';
import { Tabs, Row, Col } from 'antd';
import RoleInfo from './RoleInfo';
import RoleClaims from './RoleClaims';


const { TabPane } = Tabs;

class UserProfile extends Component {
    

    render() {
        
        return (
            <div>

                <Row>
                    <Col span={24}>
                        
                        <Tabs>
                            <TabPane tab="Role Info" key="1">                        
                                <RoleInfo data={this.props.data} />                             
                            </TabPane>

                            <TabPane tab="Permissions" key="2" disabled={!this.props.data.id}>
                                <RoleClaims data={this.props.data} />
                            </TabPane>

                        </Tabs>

                    </Col>
                </Row>
                    
            </div>
        )
    }
};

export default UserProfile;