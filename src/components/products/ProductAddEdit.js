import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button } from 'reactstrap'

import * as API from '../../services/API'

import InputDisplays from '../InputDisplays.js'
import { AvForm } from 'availity-reactstrap-validation'
import { Helpers, TOAST } from '../../helpers/helpers'

// import { Helpers, lS, DefaultState, TOAST, OPTIONS  } from '../helpers/helpers'

import Loader from '../Loader'

const qs = require('query-string');

class ProductAddEdit extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data: {},
        isLoading: true,
        fields: [
            {
                title: "Product Details",
                inputs: [
                    {
                        name: "name",
                        label: "Name",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter first name"}, 
                        }
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "text",
                        isRequired: true,
                        validators: {
                            required: {value: true, errorMessage: "Please enter description"}, 
                        }
                    },
                    {
                        name: "price",
                        label: "Price",
                        type: "float",
                        isRequired: true,
                        pre: 'P',
                        validators: {
                            required: {value: true, errorMessage: "Please enter price"}, 
                            min: {value: 0, errorMessage: "Price must be valid"}
                        }
                    },{
                        name: "file",
                        label: "Photo",
                        type: "file",
                        isRequired: false,
                        handleInputChange: (e) => {
                            const formData = new FormData()
                            formData.append('file', e.target.files[0], e.target.value)
                            console.log(formData, e.target.files[0])
                            this.setState({file_name : e.target.value, file: e.target.files[0]})
                        }
                    }
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

    getProduct = () => {
        const {id} = this.props.match.params
        API.getProduct(id)
        .then((response)=>{
            this.setState({data: response.data})
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false})
        )
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
        // values.file = this.state.file
        delete values.file
        const formData = new FormData();  
        formData.append('name', JSON.stringify(values.name));  
        formData.append('description', JSON.stringify(values.description));  
        formData.append('price', values.price);  
        formData.append("file", this.state.file);  
            // return formData;
        API.createProduct(formData)
        .then((response)=>{
            this.props.history.goBack()
            TOAST.pop({message: 'Successfully created product!'})
        }, err => {
            console.log(err)
            TOAST.pop({message: err.message, type: 'error'})
        })
    } 

    handleUpdateSubmit = (values) => {
        const {id} = this.props.match.params
        API.updateProduct(values, id)
        .then((response)=>{
            this.props.history.goBack()
            TOAST.pop({message: 'Successfully updated product!'})
        }, err => {
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
            this.getProduct()
        }
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
                <Col lg="11" sm="11" xs="11" style={{border: '2px solid rgb(252, 168, 108)', padding: '20px', margin: 'auto'}}>
                    <Loader 
                        isLoading={st.isLoading || false}
                    />
                    <div > 
                        {method} Products!
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
            </Row>
        ) ;
    }
}

export default withRouter(ProductAddEdit);