import React from 'react';
import { Select, Modal, DatePicker } from 'antd';
import IntlMessages from 'util/IntlMessages';
import moment from 'moment';
import { userService } from 'services/UserService.js';
import { notify } from 'util/Notify';

class RolePickerModal extends React.Component {
    constructor(props) {
        super(props);
                console.log(this.props);
        this.state = {
            modal: false,
            roleid: this.props.roles.length > 0 ? this.props.roles[0].id : "",
            startDate: null,
            expiryDate: null
        };
    } 

    // select form field event
    handleChanges = (val) => {
        this.setState({ roleid: val });
    }
    
    // start date event
    handleStartDayChange = (day) => {
        if(typeof day === "object") // make sure we're getting a moment object
        {
            let startDate = day.format();
            this.setState({startDate});
        }        
    };
    
    // expiry date event
    handleExpiryDayChange = (day) => {
        if(typeof day === "object") // make sure we're getting a moment object
        {
            let expiryDate = day.format();
            this.setState({expiryDate});
        }        
    };

    // shows/hides the modal (called from parent or here)
    handleToggle = () => {        
        this.setState({
            modal: !this.state.modal
        });
    }   
    
    // submit event
    handleOk = () => {
        // update the db
        userService.addRoleToUser(this.props.userId, this.state.roleid, this.state.startDate, this.state.expiryDate)
        .then(data => {
            notify.success('You have successfully added the role');
            
            this.handleToggle();
            if(this.props.reload)
                this.props.reload();
        })
        .catch(err => {
            notify.error(err);
        });
    }

    render() {
        
        return (
            <Modal
                title={<IntlMessages id="manage.user.modal.addrole"/>}
                visible={this.state.modal} 
                className="modal-sm"
                getContainer={false}
                onOk={this.handleOk}
                onCancel={this.handleToggle}
                >
                
                    <div className="row mb-3">
                        <div className="col-sm-12">
                            <label className="mb-2">Role</label>
                            <div>
                                <Select
                                    id="roleid"
                                    value={this.state.roleid}
                                    onChange={this.handleChanges}
                                    className="w-90"
                                >
                                    {
                                        this.props.roles && this.props.roles.map((p, i) => {
                                            return <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-12">
                            <label className="mb-2">Start</label>
                            <div>
                            <DatePicker 
                                showTime 
                                placeholder="Select Date/Time" 
                                value={this.state.startDate && moment(this.state.startDate)}
                                onChange={this.handleStartDayChange} 
                                onOk={this.handleStartDayChange} />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-12">
                            <label className="mb-2">Expires</label>
                            <div>
                            <DatePicker 
                                showTime 
                                placeholder="Select Date/Time" 
                                value={this.state.expiryDate && moment(this.state.expiryDate)}
                                onChange={this.handleExpiryDayChange} 
                                onOk={this.handleExpiryDayChange} />
                            </div>
                        </div>
                    </div>

            </Modal>
        );
    }
}

export default RolePickerModal;