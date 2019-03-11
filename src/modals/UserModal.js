import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';

import SimpleForm from 'components/SimpleForm';
import * as API from 'services/API';

class UserModal extends Component {
    state = {
        formErrorVisible: false,
        formErrorMessage: ""
    }
    onRequestSubmit = (data) => {
        const { mode } = this.props
        delete data.confirmPassword
        switch (mode) {
            case "UPDATE":
                this.apiUpdate(data)
                break
            default: 
                this.apiCreate(data)
                break
        }
    }

    apiCreate = (data) => {
        API.createUser(data)
        .then( response => {
            if (response.errors) {
                this.toggleFormDismissError(true,response.errors[0].message)
                return
            }
            this.props.toggle()
            this.props.onSuccess()
        });
    }

    apiUpdate = (data) => {

    }

    toggleFormDismissError = (flag, err = "") => {
        this.setState({
            formErrorVisible:flag,
            formErrorMessage: err
        })
    }
    handleFormErrors = (errors) => {
        this.toggleDismisErr(true,"Please fix all invalid field(s).")
    }
    sampleData = () => {
        return {
            username: "niel03",
            emailAddress: "corn@cor.com",
            firstName: "Fernan",
            lastName: "Principe",
            password: "asdasd",
            confirmPassword: "asdasd",
            role: "1",
            contactNo: "09932223333",
            addressLine1: "",
            addressLine2: "",
            addressProvince: "",
            addressCity: ""
        }
    }
    render() {
        const { isOpen, modalTitle, inputs, toggle, size, userData } = this.props
        const { formErrorMessage, formErrorVisible } = this.state
        const sampData = this.sampleData() // DEBUG
        return (
            <div>
                <Modal
                    size={size}
                    isOpen={isOpen}
                    toggle={toggle}
                    modalTitle={modalTitle}
                    modalBody={
                        (    
                            <SimpleForm 
                                ref={el => { this.simpleForm = el }}
                                inputs={inputs}
                                data={sampData} // DEBUG
                                formErrorMessage={formErrorMessage}
                                formOnDismissError={this.toggleFormDismissError}
                                formErrorVisible={formErrorVisible}
                                onRequestSubmit={this.onRequestSubmit}
                                onFormError={this.handleFormErrors}
                            />
                        )
                    }
                    modalFooter={
                        (
                            <Button
                                title="Submit"
                                onClick={() => {
                                    this.simpleForm.form.submit()
                                }}>
                                Submit
                            </Button>
                        )
                    }
                />
            </div>
        );
    }
}

export default UserModal;