import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button } from 'reactstrap'

import { Persist } from 'react-persist'

import * as API from '../services/API'
import * as Session from '../services/session'

import InputDisplays from './InputDisplays.js'
import { AvForm } from 'availity-reactstrap-validation'
import { REG_EX_NO_SPACE, MIN_CHAR, MAX_CHAR, Helpers, TOAST } from '../helpers/helpers'
import { MESSAGE_NO_SPACE, MESSAGE_MIN_CHAR, REG_EX_EMAIL, MESSAGE_EMAIL } from '../helpers/helpers'

// import { Helpers, lS, DefaultState, TOAST, OPTIONS  } from '../helpers/helpers'

import { FontAwesome } from '../icon.js'

import Loader from './Loader'
import { lstat } from 'fs';

const { FaEllipsisV } = FontAwesome
const qs = require('query-string');
const pass_min = 6

class Register extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        titleHeader: 'Home',
        query: this.urlSearch.search || '',
        pageState: {
            page: (parseInt(this.urlSearch.page || 0) > 0 ? (parseInt(this.urlSearch.page || 0) - 1 ) : 0),
            limit: parseInt(this.urlSearch.limit || 10),
            search: this.urlSearch.search || '',
            status: this.urlSearch.status || 'active',
            sort_id: this.urlSearch.sort_id || 'code',
            sort_desc: this.urlSearch.sort_desc,
            filter: {
                code: this.urlSearch.code,
                name: this.urlSearch.name,
                description: this.urlSearch.description
            }
        },
        data: {},
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
                            // pattern: {value: REG_EX_NO_NUM, errorMessage: `Country name ${MESSAGE_NO_NUM}`},
                            minLength: {value: MIN_CHAR, errorMessage: `First Name ${MESSAGE_MIN_CHAR}`},
                            maxLength: {value: MAX_CHAR, errorMessage: `First Name ${MESSAGE_MIN_CHAR}`}
                        }
                    },
                    {
                        name: "last_name",
                        label: "Last Name*",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter last name"}, 
                            // pattern: {value: REG_EX_NO_NUM, errorMessage: `Country name ${MESSAGE_NO_NUM}`},
                            minLength: {value: MIN_CHAR, errorMessage: `Last Name ${MESSAGE_MIN_CHAR}`},
                            maxLength: {value: MAX_CHAR, errorMessage: `Last Name ${MESSAGE_MIN_CHAR}`}
                        }
                    },
                    {
                        name: "username",
                        label: "Username*",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter username"}, 
                            pattern: {value: REG_EX_NO_SPACE, errorMessage: `Username ${MESSAGE_NO_SPACE}`},
                            minLength: {value: MIN_CHAR, errorMessage: `Username ${MESSAGE_MIN_CHAR}`},
                            maxLength: {value: 16, errorMessage: `Username ${MESSAGE_MIN_CHAR}`}
                        }
                    },
                    {
                        name: "password",
                        label: "Password*",
                        type: "password",
                        isRequired: true,
                        style: this.props.optionalStyle,
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
                        style: this.props.optionalStyle,
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
                            pattern: {value: REG_EX_EMAIL, errorMessage: `Your email address ${MESSAGE_EMAIL}`},
                        }
                    },
                    {
                        name: "phone_number",
                        label: "Phone Number*", 
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
                        label: "Role*",
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

    selectActionToggled = (item) => {
        this.setState({
            itemData: item
        })
    }
    showCreateItemCreateModal = () => {
        this.setState((oldState) => ({
            isCreateModalOpen: !oldState.isCreateModalOpen
        }))
    }

    responseGetItems = (response) => {
        const st = this.state
        response = response || {}
        response.data = response.data || [];
        let configState = {
            data: response.data,
            total: response.total,
            totalPage: Math.ceil( (response.total || 0) / st.pageState.limit) 
        }
        // configState.totalPage = Math.ceil(configState.data.length / st.pageState.limit) 
        this.setState(configState)
    }
    
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

    fetchData = () => {
        document.getElementsByClassName('rt-tbody')[0].scrollTop = 0;
        const that = this;
        const st = this.state
        const params = { 
            page: (st.pageState.page+1), 
            limit: st.pageState.limit,
            search: st.pageState.search,
            status: (st.pageState.status === 'all') ? '': st.pageState.status,
            sort_id: st.pageState.sort_id || '',
            sort_desc: (!st.pageState.sort_id) ? '' :
                       (st.pageState.sort_desc || '').toString() === 'true' ? 'desc' : 'asc',
            ...st.pageState.filter
        }

        // API.getCountries({params})
        //     .then(response => {
        //         console.log(response)
        //         this.responseGetItems(response) 
        //     }, err=> {
        //         this.setState({data:[]});
        //     }).finally(()=>{
        //         this.setState({ searchLoading: false, apiParams: params })
        //     })
    }

    getRoles = () => { 
        const { mode } = this.state
        const defaultRole = [{ id:'', role:'No Roles' }] 
        const params = { 
            page: 1, 
            limit: 1000
        }
        API.getRoles({params})
            .then(response => {
                const { fields, buttonDisable } = this.state 
                response = response || {data:[]}
                const data = []
                response.data.map((role)=> (data.push({'id': role.id, 'name': role.name, 'label': role.name})))
                const new_items = (typeof data === 'undefined')
                    ? defaultRole : (data.length > 0)
                    ? data : defaultRole
                const new_fields = [
                    {
                        ...fields[0],
                        inputs: [
                            ...fields[0].inputs.map((input, idx) => {
                                if (input.name === 'role') {
                                    console.log(input)
                                    console.log(new_items)
                                    return {
                                        ...input,
                                        options:new_items
                                    }
                                } else {
                                    return { ...input }
                                }
                            })
                        ]
                    }
                ]
                this.setState({ 
                    fields: new_fields
                })
            })
            .finally(() => {
                setTimeout(()=> {
                    this.setState({ isLoading:false })
                }, 100)
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

    handleSubmit = (event, values) => {
        const body = {...values}
        API.createUser(values)
        .then((response)=>{
            this.props.history.push('/')
            Session.saveUser(response.data)
            TOAST.pop({message: 'Successfully registered'})
        }, err => {
            console.log(err)
            TOAST.pop({message: err.message, type: 'error'})
        }).catch(err => {
            console.log(err)
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
        this.getRoles()
        // const role_permission = lS.get('role_permission').role_permission.filter((module) => module.modules==='COUNTRY')
        // if(!role_permission[0].has_read){
        //     this.props.history.goBack()
        // } else {
        //     Helpers.callBackMessageToastPop() 
        //     this.setState({searchLoading: true, mounted: true, checkData:[], data:[]},()=>{
        //         this.fetchData()
        //     })
        // }
        // this.setState({role_permission})
    }

    // componentWillReceiveProps(newProps) {
    //     const st = this.state
    //     const filters_array = Helpers.objectToArray(st.pageState.filter, true) || []
    //     this.setState({showAdvancedSearch: filters_array.length > 0 })
    //     if ( typeof st.mounted !== 'undefined') {
    //         let pageQs = qs.parse(this.props.history.location.search)
    //         this.setState({
    //             pageState: {
    //                 page: parseInt(pageQs.page || 0) > 0 ? ( parseInt(pageQs.page || 0) - 1): 0,
    //                 limit: parseInt(pageQs.limit || 10),
    //                 search: st.query,
    //                 status: st.searchAddDrp.selected,
    //                 sort_id: pageQs.sort_id || st.pageState.sort_id,
    //                 sort_desc: !!pageQs.sort_desc,
    //                 filter: st.pageState.filter
    //             },
    //             searchLoading: true
    //         },()=>{
    //             this.fetchData();
    //         })
    //     } 
    // }

    componentWillUnmount() {
        const st = this.state
        this.setState({checkData: [], data: [] })
    }

    render() {
        const that = this
        const st=this.state;

        const {data, fields} = this.state
        const inputs = fields.reduce((inputs, step) => {
            return {
                ...inputs,
                [step.title]: step.inputs,
            }
        }, {})
        return(
            <Row >
                <Col lg="10" sm="11" xs="11" style={{border: '2px solid rgb(252, 168, 108)', padding: '20px', margin: 'auto'}}>
                    <div > 
                        Register!
                        <AvForm onValidSubmit={this.handleSubmit} ref={c => (this.form = c)}> 
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={6}>
                                    <InputDisplays 
                                        inputs={inputs}
                                        data={data} 
                                    />
                                    {/* <CheckboxItem 
                                        name="status"
                                        checked={data.status}
                                        label={"Is Active?"}
                                        trueValue={"ACTIVE"}
                                        falseValue={"INACTIVE"} /> */}
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={6}></Col>
                            </Row>
                            <Row className="margin-bottom-md">
                                <Col xs={12} sm={12} md={12} lg={6}>
                                    <Button 
                                        type="button" 
                                        color="secondary" 
                                        onClick={this.resetForm} >Clear</Button>
                                    <Button 
                                        type="submit" 
                                        className="float-right" 
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

export default withRouter(Register);