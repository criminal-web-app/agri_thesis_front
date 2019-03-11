import React, { Component } from 'react';
import { CardBody, Form, FormGroup, /*CardTitle,*/ Input, Fade, FormFeedback, Button } from 'reactstrap'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import serializeForm from 'form-serialize'

import * as API from '../services/API'
import '../styles/Login.css'

import { lS } from '../helpers/helpers'
import { SyncLoader } from 'react-spinners'
import { FaKey, FaUser } from 'react-icons/fa';

class LoginForm extends Component {
    state = {
        loading: false,
        dropdownOpen: false,
        type: 'ADMIN',
        demo: null,
    }
    handleSignIn = (e) => {
        e.preventDefault()
        const values = serializeForm(e.target, { hash: true }) // returns an object from input values based on name e.g. {name: "name", email: "email@.e.com"}
        this.signIn(values)
    }
    signIn = (values) => {
        this.toggleLoading()
        API.login(values)
        .then((response) => {
            this.toggleLoading()
            if (response.success) {
                const res = {
                    ...response,
                    data: {
                        ...response.data,
                        ...response.data.user,
                        role_permission: []
                    }
                }
                lS.set('role_permission', {role_permission: response.data.user.role_permission }) // response.data.user.role_permission
                this.props.onSuccess(res, 'SUPER_ADMIN') // change back to response.data.items[0].role
                return
            } else {
                this.props.onError(response.error) 
            }
        })
        .catch((err) => { 
            this.toggleLoading()
            this.props.onError(err ? err : {context:'An unknown error has occured', code:"404"})
        })
    }
    toggleLoading = () => {
        this.setState((oldState) => ({
            loading: !oldState.loading
        }))
    }
    dropToggle = () => {
        this.setState((oldState) => ({
            dropdownOpen: !oldState.dropdownOpen
        }))
    }
    prefill (item) {
        this.setState({
            demo: item
        })
        let values = {
            email: item.email,
            password: '12345aA!'
        }
        this.signIn(values)
    }
    render() {
        const { loading, demo } = this.state;
        const { onLogin, isInvalid, errorMessage, btnText } = this.props
        return (
            <div>
                <Form className="formClass"
                    onSubmit={(e) => {
                        this.handleSignIn(e)
                    }}
                    >
                    
                    <FormGroup>
                        <img 
                            className="icon-img" 
                            src={FaUser}
                            alt="user"
                        />
                        <Input 
                            name="username"
                            className="details"
                            placeholder="username"
                            type="text"
                            invalid={isInvalid}
                            required 
                        />
                    </FormGroup>
                    <FormGroup>
                        <img 
                            className="icon-img" 
                            src={FaKey}
                            alt="user"
                        />
                        <Input 
                            name="password"
                            className="details"
                            placeholder="password"
                            type="password"
                            invalid={isInvalid}
                            required
                        />
                        <FormFeedback className="text-capitalize feedback">{errorMessage}</FormFeedback>
                    </FormGroup>
                    {loading && (
                        <div className="text-center sync-loader">
                            <SyncLoader
                                color='#2f79ef'
                                loading={loading} 
                                size={10}
                                style={{
                                    height: '10px'
                                }}
                            />
                        </div>
                    )}
                    {!loading && (
                        <Button type="submit"
                            color="info"
                            // size={10}
                            // block={true}
                        >
                            Login
                        </Button>
                    )}
                </Form>
            </div>
        );
    }
}

export default LoginForm;
