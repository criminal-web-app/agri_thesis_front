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
                        type: "select-dropdown",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please choose role"}, 
                        },
                        options: [],
                        returnLabel: true,
                        optionKeys:{
                            label:'name',
                            value:'id'
                        },
                        handleInputChange: ({input, title}) => (selectedOption)=>{
                            const st = this.state
                            const index = st.fields.findIndex(x=>x.title === title)
                            this.setState({ 
                                fields: [
                                    {
                                        ...st.fields[index],
                                        inputs: [
                                            ...st.fields[index].inputs.map(inp=>{ 
                                                return (inp.name===input.name) ? { ...inp, selectedValue: selectedOption.value } : { ...inp }
                                            }) 
                                        ]
                                    }
                                    
                                ] 
                            })
                            this.handleEmptyField('role', selectedOption.value)
                        },
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
                                  confirm_password: response.data[0].password}})
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
        const role = this.state.roles.filter((role)=> role.name === values.role)[0]
        values.role = role.id
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
        const role = this.state.roles.filter((role)=> role.name === values.role)[0]
        values.role = role.id
        API.updateUser(values, id)
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

    getRoles = () => { 
        const params = { 
            page: 1, 
            limit: 1000
        }
        API.getRoles({params})
        .then(response => {
            const st = this.state
            const { fields } = this.state 
            const data_role = response.data.filter((role)=> role.id === st.data.role_id)
            const role_name = data_role.length ? data_role[0].name : ''
            response = response || {data:[]}
            const data = response.data.map((role)=> {return {'id': role.id, 'name': role.name, 'label': role.name}})
            const new_fields = [
                {
                    ...fields[0],
                    inputs: [
                        ...fields[0].inputs.map((input, idx) => {
                            if (input.name === 'role') {
                                return {
                                    ...input,
                                    options:data,
                                    selectedOption: data_role,
                                    selectedValue: role_name,
                                }
                            } else {
                                return { ...input }
                            }
                        })
                    ]
                }
            ]
            this.setState({ 
                fields: new_fields,
                roles: response.data
            })
        })
        .finally(() => {
            setTimeout(()=> {
                this.setState({ isLoading:false })
            }, 100)
        })
    }

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    componentDidMount = () => {
        const {method} = this.props

        this.getRoles()
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