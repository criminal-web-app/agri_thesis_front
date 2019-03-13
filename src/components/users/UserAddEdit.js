import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button } from 'reactstrap'

import * as API from '../../services/API'

import InputDisplays from '../InputDisplays.js'
import { AvForm } from 'availity-reactstrap-validation'
import { Helpers, TOAST, REG_EX_NO_SPACE, REG_EX_EMAIL } from '../../helpers/helpers'

import Loader from '../Loader'

const pass_min = 6
const qs = require('query-string');
const roles = [{label: 'admin', value: 'admin'},
                {label: 'customer', value: 'customer'},
                {label: 'staff', value: 'staff'}]

class UserAddEdit extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data: {},
        fields: [
            {
                title: "User Details",
                inputs: [
                    {
                        name: "first_name",
                        label: "First Name",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter first name"}, 
                            minLength: {value: 2, errorMessage: `First Name too short`},
                        }
                    },
                    {
                        name: "last_name",
                        label: "Last Name",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter last name"}, 
                            minLength: {value: 2, errorMessage: `Last Name too short`},
                        }
                    },
                    {
                        name: "username",
                        label: "Username*",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter username"}, 
                            pattern: {value: REG_EX_NO_SPACE, errorMessage: `Username cannot contain space`},
                            // minLength: {value: 2, errorMessage: `Username too short`},
                            // maxLength: {value: 16, errorMessage: `Username too long`}
                        }
                    },
                    {
                        name: "password",
                        label: "Password",
                        type: "password",
                        isRequired: true,
                        style: this.props.hidePass,
                        validators: {
                            required: {value: true, errorMessage: "Please enter your password"},
                            minLength: {value: pass_min, errorMessage: `Your password must be atleast 6 characters`},
                        }
                    },
                    {
                        name: "confirm_password",
                        label: "Confirm Password",
                        type: "password",
                        isRequired: true,
                        style: this.props.hidePass,
                        validators: {
                            match:{value:'password', errorMessage: 'Password does not match'},
                            required: {value: true, errorMessage: "Please enter confirm password"},
                        }
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter email address"}, 
                            pattern: {value: REG_EX_EMAIL, errorMessage: `Your email address must be valid`},
                        }
                    },
                    {
                        name: "phone_number",
                        label: "Phone Number", 
                        type: "number",
                        isRequired: true, 
                        underscores:0,
                        validators: {
                            required: {value: true, errorMessage: "Please enter contact number"}, 
                            minLength: {value: 11, errorMessage: `Please provide valid number`}, 
                            min: {value: parseInt(9050000000), errorMessage: `Please provide valid number`},
                            max: {value: parseInt(9999999999), errorMessage: `Please provide valid number`}
                        },
                    },
                    {
                        name: "role",
                        label: "Role",
                        type: "select",
                        isRequired: true,
                        hasEmptyOption: true,
                        options: roles,
                    },
                    {
                        name: "address",
                        label: "Address",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter address"}, 
                        }
                    },
                ]
            }, 
        ]
    }

    prevColumn = this.state.columns || {}

    handleEmptyField = (accessor, value) => { 
        const { data } = this.state
        const val = (typeof value === 'undefined') ? '' : value
        this.setState({
            data: {
                ...data,
                [accessor]:val
            }
        }) 
    }

    selectActionToggled = (item) => {
        this.setState({
            itemData: item
        })
    }

    changeKeyValue = (key, value) => {
        this.setState((oldState)=>({
            [key]: value || !oldState[key]
        }))
    }

    formHandleChange = (e, v) => {
        const st = this.state
        let name = (typeof e === "object") ? e.target.name : e
        let value = (typeof e === "object") ? e.target.value : v
        let newData = Helpers.setDataIterate(name, value)(st.data, '')
        this.setState({ data: newData})
    } 

    getUser = () => {
        const {id} = this.props.match.params
        API.getUser(id)
        .then((response)=>{
            this.setState({data: {...response.data[0],
                                    confirm_password: '123456',
                                    password: '123456'}})
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        })
    }

    handleSubmit = (event, values) => {
        const {method} = this.props
        if(method==='Create'){
            this.handleCreateSubmit(values)
        } else {
            this.handleUpdateSubmit(values)
        }
    }

    handleCreateSubmit = (values) => {
        API.createUser(values)
        .then((response)=>{
            this.props.history.goBack()
            TOAST.pop({message: 'Successfully created user!'})
        }, err => {
            console.log(err)
            TOAST.pop({message: err.message, type: 'error'})
        })
    } 

    handleUpdateSubmit = (values) => {
        const {id} = this.props.match.params
        delete values.confirm_password
        delete values.password
        const params = {
            role : values.role
        }
        API.updateUser(values, id, {params})
        .then((response)=>{
            this.props.history.goBack()
            TOAST.pop({message: 'Successfully updated user!'})
        },err => {
            TOAST.pop({message: err.message, type: 'error'})
        })
    } 

    resetForm = () => {
        this.form && this.form.reset() 
        // this.form._inputs.status.value = this.state.defaultStatus
    }

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    componentDidMount = () => {
        const {method} = this.props

        if(method==='Update'){
            this.getUser()
        }
    }

    componentWillUnmount() {
        const st = this.state
        this.setState({checkData: [], data: [] })
    }

    render() {
        const that = this
        const st=this.state;

        const {data, fields} = this.state
        const {method} = this.props
        const inputs = fields.reduce((inputs, step) => {
            return {
                ...inputs,
                [step.title]: step.inputs,
            }
        }, {})
        console.log(st)
        return(
            <Row >
                <Col lg="10" sm="11" xs="11" style={{border: '2px solid rgb(252, 168, 108)', padding: '20px', margin: 'auto'}}>
                    <div > 
                        {method} User!
                        <AvForm onValidSubmit={this.handleSubmit} ref={c => (this.form = c)}> 
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={6}>
                                    <InputDisplays 
                                        inputs={inputs}
                                        data={data} 
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={6}></Col>
                            </Row>
                            <Row className="margin-bottom-md">
                                <Col xs={12} sm={12} md={12} lg={6} align="right">
                                    <Button 
                                        type="button" 
                                        color="secondary" 
                                        // className="float-left"
                                        style={{marginRight: '20px'}}
                                        onClick={this.resetForm} >Clear</Button>
                                    <Button 
                                        type="submit" 
                                        // className="float-right" 
                                        color="primary"
                                        onClick={this.createUser}>Submit</Button>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={6}></Col>
                            </Row>
                        </AvForm>
                        
                    </div>
                </Col>
                <Loader
                    message={(
                        <div>
                            {/* <h4>Fetching reports</h4> */}
                            <p>Loading...</p>
                        </div>
                    )}
                    isLoading={st.isLoading || false}
                />
            </Row>
        ) ;
    }
}

export default withRouter(UserAddEdit);