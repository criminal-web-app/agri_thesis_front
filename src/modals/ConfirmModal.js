import React, { Component } from 'react';
import { Button } from 'reactstrap';

import Modal from '../components/Modal';
import Toastr from '../helpers/Toastr.js'

class ConfirmModal extends Component {

    state = {
        toast: {
            type: "",
            message: "",
            show: false
        },
        isConfirmClick: this.props.isConfirmClick || false,
        id: '',
        ids: []
    }

    onConfirm = () => {
        const pr = this.props
        let prids = pr.ids || []
        const { itemData, method, takeAction} = this.props;
        this.setState({isConfirmClick: true, id: itemData.id, ids: prids[0] }, () => {
            if (typeof method=== "function") {
                method(itemData)
                    .then( response => {
                        this.props.onDeleteItem() 
                        this.showToast(response.data[0].message,'success')                                      
                    }, err=> {
                        this.showToast(err[0].context,'error')
                        this.setState({isConfirmClick: false})
                        return
                    })
                this.props.toggle()               
            }
           
            if (typeof takeAction === "function") {
                takeAction()
            }  
        })

    }

    showToast = (message, type) => {
        this.setState({
            toast: {
                type: type,
                message: message,
                show: true
            }
        }) 
    }

    componentWillReceiveProps(newProps) {
        const that = this
        this.setState({
            isConfirmClick: ( newProps.isConfirmClick ) || false,
            error: newProps.error,
            
        },()=>{
            setTimeout(function(){
                if (!newProps.isConfirmClick)
                that.setState({id: ''})
            }, 300) 
        })
    } 

    componentDidUpdate() {
        const pr = this.props
        
        if (!pr.disabledConfirmFocus && document.getElementById('confirmButton'))
            document.getElementById('confirmButton').focus()
    }

    render() {
        const st = this.state
        const pr = this.props
        const { toast } = this.state     
        const { itemData, isOpen, size, modalTitle, modalBody, enableToaster = true} = this.props
        return (
            <div>
                <Modal
                    size={size}
                    isOpen={isOpen}
                    toggle={this.props.toggle}
                    modalTitle={modalTitle}
                    modalBody={modalBody}
                    modalFooter={
                        (
                            <div style={
                                {
                                    height: "38px"
                                }
                            }>
                                <Button 
                                    style={
                                        {
                                            "position": "absolute",
                                            "left": "18px"
                                        }
                                    }
                                    onClick={this.props.toggle}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    id="confirmButton"
                                    disabled={ (pr.disableConfirmButton || (st.isConfirmClick || !pr.error)) && (itemData.id === st.id || pr.isConfirmClick) }
                                    color="primary"
                                    style={
                                        {
                                            "position": "absolute",
                                            "right": "18px"
                                        }
                                    }
                                    onClick={this.onConfirm}
                                >
                                    {st.isConfirmClick || pr.isConfirmClick ? 'Loading...' :  'Confirm'}
                                </Button>
                            </div>
                        )
                    }>
                </Modal>
                { enableToaster && (
                    <Toastr 
                        type={toast.type}
                        visible={toast.show}
                        message={toast.message}
                        onClose={
                            () => {
                                this.setState(oldState=>({
                                    toast: {
                                        ...oldState.toast,
                                        show: false
                                    }
                                }))
                            }
                        } 
                    />    
                )}

            </div>
        );
    }
}

export default ConfirmModal;