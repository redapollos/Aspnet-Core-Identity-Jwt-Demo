import React from 'react';
import IntlMessages from 'util/IntlMessages';
import { userService } from 'services/UserService.js';
import { roleService } from 'services/RoleService.js';
import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, Card, Input, Tag, Select } from "antd";
import UserAddModal from "./modals/UserAddModal";
import SystemContext from 'context/SystemContext';

const { Search } = Input;

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
            roles: [],
            pages: 0,
            keyword: "",
            roleid: "",
            pagination: { current: 1, pageSize: 20, position: ['topRight', 'bottomRight'], showSizeChanger: true },
            sorted: { id: 'lastName', desc: false },
            gridview: true
        };

        this.userAddModal = React.createRef();
    }

    
    componentDidMount() {

        // see if there is a role filter being passed
        let { roleid } = this.props.match.params;
        
        // if id doesn't exist
        if(roleid !== undefined) {            
            this.setState({
                roleid: roleid
            });
        }
        

        this.setState ({ loading: true });

        // get roles
        roleService.get()
            .then(data => {                
                this.setState ({
                    roles: data
                });

                // initial load of the table
                this.search();
            })
            .catch(err => console.log(err))
            .finally(() => {                
                this.setState ({
                    loading: false
                });
            })

        
    }

    search = () => {

        this.setState ({ loading: true });

        userService.get(this.state.pagination.current, this.state.pagination.pageSize, this.state.sorted, this.state.keyword, this.state.roleid)
            .then(data => {
                const pager = { ...this.state.pagination };
                pager.total = data.totalRecords;

                this.setState ({
                    users: data.users,
                    pagination: pager
                });
            })
            .catch(err => console.log(err))
            .finally(() => {                
                this.setState ({ loading: false });
            })
    }

    handleTableChange = (pagination, filters, sorter) => {
        let sorted = { ...this.state.sorted };
        const pager = { ...this.state.pagination };
        if(pager.pageSize !== pagination.pageSize) {
            pager.pageSize = pagination.pageSize;
            pager.current = 1;
        }
        else {
            pager.current = pagination.current;
        }

        if(sorter.field)
            sorted = { id: sorter.field, desc: sorter.order === "descend" }

        this.setState({
            pagination: pager,
            sorted
        }, this.search);        
    };
    
    handleFieldChange = (evt) => {
        this.setState({[evt.target.id]: evt.target.value});
    }

    handleSearch = (keyword) => {
         this.search();
    }

    handleRoleChange = (roleid) => {
        this.setState({ roleid: roleid }, this.search);
    }
    
    toggleProfile = () => {
        this.userAddModal.current.handleToggle();
    }

    userAdded = () => {
        this.search();
    }


    render() {        
        
        return (
            <Card
                title={<IntlMessages id="manage.users.title"/>}
                extra={ <Button type="primary" icon={<PlusOutlined />} color="btn btn-light" onClick={this.toggleProfile} title="Add User">Add User</Button> }
            >

                <div>
                    
                    <div className="w-60 mb-3 text-right float-right">
                        <Select
                            id="roleid"
                            value={this.state.roleid}
                            onChange={this.handleRoleChange}
                            className="w-30 mr-2"
                        >
                            <Select.Option key={0} value="">All Roles</Select.Option>
                            {
                                this.state.roles && this.state.roles.map((p, i) => {
                                    return <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                                })
                            }
                        </Select>

                        <Search
                            id="keyword"
                            placeholder="search"
                            onSearch={this.handleSearch}
                            enterButton
                            className="w-50"
                            value={this.state.keyword}
                            onChange={this.handleFieldChange}
                            loading={this.state.loading}
                        />
                    </div>
                    

                    <Table
                        dataSource={this.state.users}
                        rowKey={x => x.id}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                        size="middle"
                        className="clear-both pointer"
                        onChange={this.handleTableChange}                        
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: e => {
                                    this.props.history.push(`/manage/security/user/${record.id}`)
                                }
                            }                                
                        }}
                        columns={[
                            {
                                title: '', dataIndex: 'thumbnail', width: '6%',
                                render: (text,record) => (
                                    <img src={record.thumbnailUrl} alt="Thumbnail" className="img-fluid avatar-50" />
                                )
                            },
                            {
                                title: 'Username', dataIndex: 'userName', sorter: true, filterMultiple: false,
                                render: (text, record) => (
                                    <span>
                                    { !record.isDeleted && <span>{record.userName}</span> }
                                    { record.isDeleted && <span className="is-deleted">{record.userName}</span> }
                                    </span>
                                )
                            },
                            {
                                title: 'First', dataIndex: 'firstName', sorter: true, filterMultiple: false
                            },
                            {
                                title: 'Last', dataIndex: 'lastName', sorter: true
                            },
                            {
                                title: 'Email', dataIndex: 'email', sorter: true
                            },
                            {
                                title: 'Phone', dataIndex: 'phoneNumber'
                            },
                            {
                                title: 'Roles', dataIndex: 'userRoles.roleId', sorter: false,
                                render: (text,record) => (
                                    <span>
                                        {
                                            record.userRoles.map((o,idx) => {
                                                return <Tag key={idx} color="blue" className="mb-1">{o.roleName}</Tag>
                                            })                                            
                                        }
                                    </span>
                                    
                                )
                            }
                        ]}
                    />
                </div>
                        
                <UserAddModal 
                    ref={this.userAddModal}
                    onSuccess={this.userAdded} />

            </Card>
        );
    }
}

UserList.contextType = SystemContext;
export default UserList;