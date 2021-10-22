import React from 'react';
import { NavLink } from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import { roleService } from 'services/RoleService.js';
import { DeleteOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Tooltip, Table, Popconfirm, Button, Card } from "antd";
import SystemContext from 'context/SystemContext';
import { notify } from 'util/Notify';

class RoleList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: []
        };
    }
    
    componentDidMount() {
        // initial load of the table
        this.loadGrid();
    }

    loadGrid = () => {

        this.setState ({ loading: true });

        roleService.get()
            .then(data => {
                
                this.setState ({
                    data: data
                });
            })
            .catch(err => console.log(err))
            .finally(() => {                
                this.setState ({ loading: false });
            })
    }

    handleDelete = (roleid) => {

        roleService.deleteRole(roleid)
            .then(data => {
                notify.success('The role has been removed');
                
                // splice out the deleted object
                var idx = this.state.data.findIndex(o => o.id === roleid);
                if(idx > -1) {
                    let list = [...this.state.data];
                    list.splice(idx, 1);
                    this.setState({
                        data: list
                    });
                }
                
            })
            .catch(err => {
                notify.error(err);
            });
    }

    render() {

        return (
            <Card 
                title={ <IntlMessages id="manage.roles.title"/> }
                extra={ <Button type="primary" onClick={() => this.props.history.push("/manage/security/role")}><PlusOutlined /> Add Role</Button> }>

                <div>                    
                    <Table
                        dataSource={this.state.data}
                        rowKey={x => x.id}
                        loading={this.state.loading}
                        size="middle"
                        className="pointer"
                        columns={[
                            {
                                title: 'Role', dataIndex: 'name', 
                                render: (text,record) => (
                                    <span>
                                        <NavLink to={`/manage/security/role/${record.id}`}>{text}</NavLink>
                                    </span>
                                )
                            },
                            {
                                title: 'Count', dataIndex: 'quantity',
                                render: (text,record) => (
                                    <span>
                                        <NavLink to={`/manage/security/users/${record.id}`}>{record.quantity} <TeamOutlined /></NavLink>
                                    </span>
                                )
                            },
                            {
                                title: '', dataIndex: 'id', width: 75,
                                render: (text,record) => (
                                    <div className="text-left">
                                        {
                                            record.normalizedName !== "ADMINISTRATOR" &&
                                                <Tooltip title="delete">
                                                    <Popconfirm
                                                        title="Are you sure you want to delete this?"
                                                        onConfirm={() => this.handleDelete(record.id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button type="secondary" danger><DeleteOutlined /></Button>                                                        
                                                    </Popconfirm>
                                                </Tooltip>       
                                        }
                                                                         
                                    </div>                                    
                                )
                            }
                        ]}
                    />
                </div>
                        
            </Card>
        );
    }
}

RoleList.contextType = SystemContext;
export default RoleList;