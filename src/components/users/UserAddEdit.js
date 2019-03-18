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
        isLoading: this.props.method==='Update' ? true : false,
        fields: [
            {
                title: "User Details",
                inputs: [
                    {
                        name: "first_name",
                        label: "First Name*",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter first name"}, 
                            minLength: {value: 2, errorMessage: `First Name too short`},
                        }
                    },
                    {
                        name: "last_name",
                        label: "Last Name*",
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
                        label: "Password*",
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
                        label: "Confirm Password*",
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
                        label: "Email*",
                        type: "email",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter email address"}, 
                            pattern: {value: REG_EX_EMAIL, errorMessage: `Your email address must be valid`},
                        }
                    },
                    {
                        name: "phone_number",
                        label: "Phone Number*", 
                        type: "number",
                        min: "0",
                        isRequired: true, 
                        underscores:0,
                        number_only: true,
                        format: "^[0-9]*$",
                        // hasOnChange: true,
                        // handleInputChange: (e) => {
                        //     console.log(e, Helpers.integerOnly(e))
                        //     this.setState({data: {...this.state.data, phone_number: Helpers.integerOnly(e)}})
                        // },
                        validators: {
                            required: {value: true, errorMessage: "Please enter contact number"}, 
                            minLength: {value: 11, errorMessage: `Please provide valid number`}, 
                            min: {value: parseInt(9050000000), errorMessage: `Please provide valid number`},
                            max: {value: parseInt(9999999999), errorMessage: `Please provide valid number`}
                        },
                        // handleInputChange: ({input, title}) => (event)=>{ 
                        //     const st = this.state
                        //     const val = event.target.value || ''
                        //     const bool = event.target.value.includes('_') ? true : false 
                        //     const underscores = event.target.value.match(/_/g)
                        //     const n_underscores = (!underscores) ? 0 : underscores.length
                        //     this.setState({ 
                        //         fields: [
                        //             {
                        //                 ...fields[0],
                        //                 inputs: [
                        //                     ...st.fields[index].inputs.map(inp=>{ 
                        //                         return (inp.name===input.name) ? { 
                        //                             ...inp, 
                        //                             invalid: bool,
                        //                             value:event.target.value,
                        //                             underscores:n_underscores,
                        //                             validators:{
                        //                                 ...inp.validators,
                        //                                 minLength:{ ...inp.validators.minLength, value:(n_underscores > 0 && n_underscores < 10) ? 17 : 16 },
                        //                                 maxLength:{ ...inp.validators.maxLength, value:(n_underscores > 0 && n_underscores < 10) ? 17 : 16 }
                        //                             }
                        //                         } : { ...inp }
                        //                     }) 
                        //                 ]
                        //             }
                        //         ] 
                        //     }, ()=> {
                        //         this.formHandleChange(input.name, val)
                        //     })
                        // }
                    },
                    {
                        name: "role",
                        label: "Role*",
                        type: "select",
                        isRequired: true,
                        hasEmptyOption: true,
                        options: roles,
                    },
                    {
                        name: "address",
                        label: "Address*",
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
                <Col lg="6" md="9" sm="11" xs="11" style={{border: '2px solid rgb(252, 168, 108)', padding: '20px', margin: 'auto'}}>
                    <div > 
                        <h4 style={{textAlign: 'center'}}>{method} User!</h4>
                        <AvForm onValidSubmit={this.handleSubmit} ref={c => (this.form = c)}> 
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={10} style={{margin: 'auto'}}>
                                    <InputDisplays 
                                        inputs={inputs}
                                        data={data} 
                                    />
                                </Col>
                                {/* <Col xs={12} sm={12} md={12} lg={6}></Col> */}
                            </Row>
                            <Row className="margin-bottom-md">
                                <Col xs={12} sm={12} md={12} lg={10} align="right" style={{margin: 'auto'}}>
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
                                {/* <Col xs={12} sm={12} md={12} lg={6}></Col> */}
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