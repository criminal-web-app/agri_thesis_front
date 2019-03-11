import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import '../styles/Login.css'
import { Form, FormGroup, Input, Row, Col, FormFeedback, Button } from 'reactstrap'

import * as API from '../services/API'
import * as Session from '../services/session'

import serializeForm from 'form-serialize'
import { SyncLoader } from 'react-spinners'
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
        // that.setState({logLoading: true})
        this.setState({isLoading: true})
        API.login(values)
        .then((response)=>{
            const role = response.data.role || ''
            // if(role.toLowerCase()!=='admin'){
            //     this.setState({
            //         isInvalid: true,
            //         errorMessage: 'Must be an admin to log in.'
            //     })
            // } else {
                Session.saveUser(response.data)
                this.setState({has_token: true},()=>this.props.history.push('/'))
            // }
        },err => {
            this.setState({
                isInvalid: true,
                errorMessage: err.message
            })
        }).finally(()=> {
            // that.setState({logLoading: false})
            this.setState({isLoading: false})
        })
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        console.log(error,info)
        console.log('Error')
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
      }

    componentDidMount(){
        this.setState({has_token: !!Session.getToken()})
    }

    render() {
        const { isInvalid, errorMessage, isLoading, has_token } = this.state
        // const has_token = Session.getToken()
        const user = Session.getUser()

        return ( 
            <div>
                 <Form className="formClass"
                    onSubmit={(e)=>this.handleLogin(e)}>
                    <Row style={{paddingLeft: '15px', paddingRight: '15px', marginBottom: '5px'}}>
                        <Input 
                            name="username"
                            className="details"
                            placeholder="username"
                            type="text"
                            invalid={isInvalid}
                            required 
                        />
                    </Row>
                    <Row className="mbot-xs-10" style={{paddingLeft: '15px', paddingRight: '15px'}}>
                        <Input 
                            name="password"
                            className="details"
                            placeholder="password"
                            type="password"
                            invalid={isInvalid}
                            required
                        />
                        <FormFeedback className="text-capitalize feedback">{errorMessage}</FormFeedback>
                    </Row>
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
                                    color='#2f79ef'
                                    loading={isLoading} 
                                    size={10}
                                    style={{
                                        height: '10px'
                                    }}
                                /> : 'Login'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>                
        );
    }
}

export default withRouter(Login);