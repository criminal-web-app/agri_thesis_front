import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import '../styles/Login.css'
import { Form, FormGroup, Input, Row, Col, FormFeedback, Button } from 'reactstrap'

import * as API from '../services/API'
import * as Session from '../services/session'

import serializeForm from 'form-serialize'
import { SyncLoader } from 'react-spinners'
import { TOAST } from '../helpers/helpers';
import { FaKey, FaUser } from 'react-icons/fa'
// import Loader from 'components/Loader'

class Login extends Component {
    state = {
        onLogin: true,
        isInvalid: false,
        isEmailInvalid: false,
        errorMessage: null,
        errorMessageClass:"",
        isLoading: false,
        has_token: false
    }
    // LOGIN METHODS
    handleLogin = (e) => {
        const {that} = this.props
        e.preventDefault()
        const values = serializeForm(e.target, { hash: true })
        this.setState({isLoading: true})
        API.login(values)
        .then((response)=>{
            const role = response.data.role || ''
            if(role.toLowerCase()!=='admin'){
                this.setState({
                    isInvalid: true,
                    errorMessage: 'Must be an admin to log in.'
                })
            } else {
                Session.saveUser(response.data)
                that.setState({dropdownOpen: false, has_token: true})
                this.setState({has_token: true},()=>this.props.history.push('/'))
            }
        },err => {
            this.setState({
                isInvalid: true,
                errorMessage: err.message
            })
        }).finally(()=> {
            this.setState({isLoading: false})
        })
    }

    handleLogOut = () => {
        const {that} = this.props
        API.logout()
        // this.setState({isLoading: true})
        .then((response)=> {
            Session.removeUser()
            this.setState({has_token: false})
            that.setState({dropdownOpen: false, has_token: false})
            this.props.history.push('/')
        },err =>{
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> {
            this.setState({isLoading: false})
        })
    }

    componentDidMount(){
        this.setState({has_token: !!Session.getToken()})
    }

    render() {
        const { isInvalid, errorMessage, isLoading, has_token } = this.state
        // const has_token = Session.getToken()
        const user = Session.getUser()
        const {that} = this.props
        return ( 
            <div>
                {!has_token ? 
                    <Form className="formClass"
                        onSubmit={(e)=>this.handleLogin(e)}>
                        <div style={{paddingLeft: '15px', paddingRight: '15px', marginBottom: '5px'}}>
                            <Input 
                                name="username"
                                className="details"
                                placeholder="username"
                                type="text"
                                invalid={isInvalid}
                                required 
                            />
                        </div>
                        <div className="mbot-xs-10" style={{paddingLeft: '15px', paddingRight: '15px'}}>
                            <Input 
                                name="password"
                                className="details"
                                placeholder="password"
                                type="password"
                                invalid={isInvalid}
                                required
                            />
                            <FormFeedback className="text-capitalize feedback">{errorMessage}</FormFeedback>
                        </div>
                        <Row>
                            <Col align="right">
                                <Button type="submit"
                                    color="info"
                                    className="mbot-xs-10"
                                    style={{float: 'right'}}
                                    disabled={isLoading}
                                    // onClick={(e)=>this.handleLogin(e)}
                                    // size={10}
                                    // block={true}
                                >
                                    {isLoading ? <SyncLoader
                                        // color='#f92d16'
                                        loading={isLoading} 
                                        size={4}
                                    /> : 'Login'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    :
                    <div>
                        <Row>
                            <Col align="right" >
                                <Button color="info" 
                                        onClick={()=> this.props.that.setState({isChangePassModalOpen: true})}
                                        style={{padding: '1px 6px', width: '100%', marginBottom: '5px'}}>
                                    Change Password
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col align="right">
                                <Button color="danger" 
                                        onClick={()=>this.handleLogOut()} 
                                        style={{padding: '1px 6px', width: '100%'}}>
                                    {isLoading ? <SyncLoader
                                        color='#f92d16'
                                        loading={isLoading} 
                                        size={8}
                                        style={{
                                            height: '8px'
                                        }}
                                    /> : 'Log out'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                }
            </div>                
        );
    }
}

export default withRouter(Login);