import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button } from 'reactstrap'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import * as API from '../services/API'
import * as Session from '../services/session'

import { Helpers, lS, DefaultState, TOAST, OPTIONS, gDp  } from '../helpers/helpers'

import SearchBar from './SearchBar.js'
import ConfirmModal from '../modals/ConfirmModal'

import {FaTrashAlt, FaEdit} from 'react-icons/fa/'
import Loader from './Loader'

const qs = require('query-string');

// React table ref: https://react-table.js.org/#/story/readme

class Products extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data:[],
        query: this.urlSearch.search || '',
        confirmUser: {name: ''},
        pageState: {
            page: (parseInt(this.urlSearch.page || 0) > 0 ? (parseInt(this.urlSearch.page || 0) - 1 ) : 0),
            limit: parseInt(this.urlSearch.limit || 10),
            search: this.urlSearch.search || '',
        },
        columns: [
            {
                Header: "Pictures",
                headerClassName: 'text-left',
                accessor: "file",
                width: 230,
                Cell: row=> {
                    return <img src={row.value} alt="No photo available" style={{height: '150px', width: '150px'}}></img>
                }
            },
            {
                Header: "Full Name",
                headerClassName: 'text-left',
                accessor: "description",
                Cell: row=> {
                    const {original} = row

                    const description = 
                        <div style={{color: '#014401'}}>
                            <h6>{original.name}</h6>
                            <div style={{fontSize: '12px', paddingLeft: '10px', lineHeight:'1'}}>Price: {Helpers.currency(original.price)}</div>
                            <div style={{paddingLeft: '5px'}}>{original.description}</div>
                        </div>

                    return description
                }
            },
            {
                Header: "Action",
                headerClassName: 'text-right grid',
                accessor: "_actions_",
                width: 80,
                Cell: row=> {return <div>
                        <Button color="danger" onClick={()=>this.setState({isItemModalOpen: true, confirmUser: row.original})}
                            className="form-control-sm-font-size input-text-sm-pd input-height-xsm button-adjust-padding-sm">
                            <FaTrashAlt/>
                        </Button>&nbsp;
                        <Button color="primary" onClick={()=>this.props.history.push(`/product/update/${row.original.id}`)}
                            className="form-control-sm-font-size input-text-sm-pd input-height-xsm button-adjust-padding-sm">
                            <FaEdit/>
                        </Button>
                    </div>
                }
            }
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
        response = response || {data:[]}
        response.data = response.data || []
        let configState = {
            data: response.data,
            total: response.total,
            totalPage: Math.ceil( (response.total || 0) / st.pageState.limit) 
        }
        // configState.totalPage = Math.ceil(configState.data.length / st.pageState.limit) 
        this.setState(configState)
    }
    
    fetchData = () => {

        document.getElementsByClassName('rt-tbody')[0].scrollTop = 0;
        const that = this;
        const st = this.state
        this.toggleLoading(true)
        const params = { 
            page: (st.pageState.page+1), 
            limit: st.pageState.limit,
            search: st.pageState.search
        }

        API.getProducts({params})
            .then(response => { 
                this.responseGetItems(response) 
            }, err=> {
                this.setState({data:[]});
            }).finally(()=>{
                this.setState({ searchLoading: false, apiParams: params })
            })
    }

    changeKeyValue = (key, value) => {
        this.setState((oldState)=>({
            [key]: value || !oldState[key]
        }))
    }

    deleteProduct = (row) => {
        const id = row.id
        const body={
            id: id
        }
        API.deleteProduct(body, id)
        .then((response)=>{
            TOAST.pop({message: response.message})
            this.setState({isItemModalOpen: false, isConfirmClick: false})
            this.fetchData()
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
            this.setState({isConfirmClick: false})
        })
    }

    handleSearch = (e) => {
        const that = this;
        const st = this.state
        e.preventDefault()
        Helpers.handlePage(that, {page: 0, limit: st.pageState.limit, search: st.query, sort_id: st.pageState.sort_id, sort_desc: !!st.pageState.sort_desc })
    }

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    componentDidMount = () => {
        Helpers.callBackMessageToastPop() 
        this.setState({searchLoading: true, mounted: true, checkData:[], data:[]},()=>{
            this.fetchData()
        })
    }

    componentWillMount(){
        const {columns} = this.state
        const has_token = Session.getToken()
        this.setState({has_token})
        if(!has_token){
            columns.splice(2,1)
            this.setState({columns: columns})
        }
    }

    componentWillReceiveProps(newProps) {
        const st = this.state
        const filters_array = Helpers.objectToArray(st.pageState.filter, true) || []
        this.setState({showAdvancedSearch: filters_array.length > 0 })
        if ( typeof st.mounted !== 'undefined') {
            let pageQs = qs.parse(this.props.history.location.search)
            this.setState({
                pageState: {
                    page: parseInt(pageQs.page || 0) > 0 ? ( parseInt(pageQs.page || 0) - 1): 0,
                    limit: parseInt(pageQs.limit || 10),
                    search: st.query,
                } 
            },()=>{
                this.fetchData();
            })
        }
    } 

    componentWillUnmount() {
        const st = this.state
        this.setState({checkData: [], data: [] })
    }

    render() {
        const that = this
        const st=this.state;
        const original = st.selected || {}
        st.data = st.data.map(d=> ({ ...d, check: st.checkData.filter(cData=>d.id===cData.id).length > 0 }))
        st.columns = [
            ...this.prevColumn,
        ]
        
        return (
            <div style={{margin: '0 5% 15px'}}> 
                <div className="pad-md">
                    <Row>
                        <Col className="margin-bottom-md">
                            <Row className="margin-bottom-md">
                                <Col md="3" style={{marginBottom: '10px'}}>
                                    <SearchBar
                                        query={st.query}
                                        placeholder={'Enter product name'}
                                        loading={st.searchLoading}
                                        didSearch={this.handleSearch}
                                        onChangeQuery={(e) => {this.setState({query: e.target.value})}}
                                    />  
                                </Col>
                                {st.has_token && <Col align="right" style={{marginBottom: '10px'}}>
                                    <Button color="primary" onClick={()=>this.props.history.push('/product/create')}>
                                        Add Product
                                    </Button>
                                </Col>}
                            </Row>
                            <Row>
                                <Col className="product_table">
                                    <ReactTable
                                        {...{
                                            ...Helpers.reactTableDefault({st, that: that}),
                                            className: 'hideHeader'
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <ConfirmModal
                        size="sm"
                        takeAction={()=>this.deleteProduct(st.confirmUser)}
                        isOpen={st.isItemModalOpen}
                        isConfirmClick={st.isConfirmClick}
                        error={st.errorDelete}
                        itemData={original}
                        modalTitle={'Delete Product'}
                        modalBody={ 
                            <p>Are you sure you want to delete product <strong>{st.confirmUser.name}</strong> ?</p>
                        }
                        onDeleteItem={this.fetchData}
                        toggle={
                            () => {
                                this.changeKeyValue("isItemModalOpen")
                            }
                        }
                    />
                </div>
                <Loader
                    message={(
                        <div>
                            {/* <h4>Fetching reports</h4> */}
                            <p>Loading...</p>
                        </div>
                    )}
                    isLoading={st.isLoading || false}
                />
            </div>
        ) ;
    }
}

export default withRouter(Products);