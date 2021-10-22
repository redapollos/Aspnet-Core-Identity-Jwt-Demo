import React, {Component} from 'react';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Table, Button, Popconfirm } from 'antd';
import moment from 'moment';
import RolePickerModal from '../modals/RolePickerModal';
import UserSettingsContext from '../context/UserSettingsContext';


class UserRoles extends Component {
    constructor(props) {
        super(props);
        this.rolePickerModal = React.createRef();
    }
    
    componentDidMount() {        
        this.context.loadRoles();
    }
    
    handleAddRole = () => {        
        this.rolePickerModal.current.handleToggle();
    }

    render() {


        return (
            <div>
                <div className="mb-2 mr-auto float-right">
                    <Button type="primary" onClick={this.handleAddRole}><PlusOutlined /> Add Role</Button>
                </div>
                
                <Table
                    className="clear-both"
                    dataSource={this.context.roles}
                    loading={this.context.loading}
                    rowKey={x => x.roleId}
                    pagination={{}}
                    columns={[
                        {
                            title: 'Role',
                            render: (t,o) => (
                                <span>
                                { o.roleName }
                                </span>                           
                            )
                        },
                        {
                            title: 'Start', dataIndex: 'startDate',
                            render: (t,o) => (
                                <span>
                                {
                                    o.startDate &&
                                        moment(o.startDate).format('LL')
                                }     
                                </span>                           
                            )
                        },
                        {
                            title: 'Expiry', dataIndex: 'expiryDate',
                            render: (t,o) => (
                                <span>
                                {
                                    o.expiryDate &&
                                        moment(o.expiryDate).format('LL')
                                }     
                                </span>                           
                            )
                        },
                        {
                            title: '', dateIndex: 'role.id', width: '50px',
                            render: (t, o) => (
                                <Popconfirm
                                    title="Are you sure you want to delete this?"
                                    onConfirm={() => this.context.deleteRole(o.roleId)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteTwoTone />
                                </Popconfirm>
                            )
                        }
                    ]}
                />
                    
                <RolePickerModal 
                    ref={this.rolePickerModal}
                    userId={this.context.user.id}
                    roles={this.context.allRoles}
                    reload={this.context.loadRoles} />
            </div>
        );
    }

}

UserRoles.contextType = UserSettingsContext;
export default UserRoles;