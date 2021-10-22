import React from 'react';
import { Modal } from 'antd';
import IntlMessages from 'util/IntlMessages';
import RegisterUser from 'modules/AccountManagement/components/RegisterUser';
import { notify } from 'util/Notify';


class UserAddModal extends React.Component {
    constructor(props) {
        super(props);
                
        this.state = {
            modal: false
        };
    } 

    // shows/hides the modal (called from parent or here)
    handleToggle = () => {        
        this.setState({
            modal: !this.state.modal
        });
    }   

    handleSuccess = () => {
                              
        // show a woo-hoo
        notify.success('You have successfully added a user');
        
        if(this.props.onSuccess)
            this.props.onSuccess();

        this.handleToggle();
    }
    
    render() {

        return (
            <Modal
                title={<IntlMessages id="manage.user.modal.adduser"/>}
                visible={this.state.modal} 
                className="modal-sm"
                onCancel={this.handleToggle}
                getContainer={false}
                footer={false}
                >
            
                <RegisterUser 
                    onSuccess={this.handleSuccess} />

            </Modal>
        );
    }
}

export default UserAddModal;