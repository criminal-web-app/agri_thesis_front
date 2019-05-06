import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button, Input } from 'reactstrap'
import ReactTable from 'react-table'

import * as API from '../services/API'
import * as Session from '../services/session'

import { Helpers, lS, DefaultState, TOAST, OPTIONS, gDp, DATE_FORMAT  } from '../helpers/helpers'

import SearchBar from './SearchBar.js'
import ConfirmModal from '../modals/ConfirmModal'

import background from '../pic/photo.jpg';
import {FaTrashAlt, FaEdit, FaCheck, FaTimes} from 'react-icons/fa/'
import Loader from './Loader'
const moment = require('moment');

const qs = require('query-string');

// React table ref: https://react-table.js.org/#/story/readme

class Products extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data: [],
        query: this.urlSearch.search || '',
        confirmUser: {username: ''},
        filter: 'ALL',
        pageState: {
            page: (parseInt(this.urlSearch.page || 0) > 0 ? (parseInt(this.urlSearch.page || 0) - 1 ) : 0),
            limit: parseInt(this.urlSearch.limit || 10),
            sort_id: this.urlSearch.sort_id || 'created',
            sort_desc: this.urlSearch.sort_desc || 'desc',
            search: this.urlSearch.search || '',
        },
        columns: [
            {
                Header: "Product",
                headerClassName: 'text-left',
                accessor: "product_name",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            
            // {
            //     Header: "Status",
            //     headerClassName: 'text-left',
            //     accessor: "status",
            //     Cell: row=> Helpers.handleDisplay(row.value)
            // },
            
            {
                Header: "Name",
                headerClassName: 'text-left',
                accessor: "last_name",
                Cell: row=> Helpers.handleDisplay(((row.original.last_name) ? (row.original.last_name+', ') : '') + row.original.first_name || '')
            }, 
            {
                Header: "Address",
                headerClassName: 'text-left',
                accessor: "address",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Mobile No.",
                headerClassName: 'text-left',
                accessor: "phone_number",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Email Address",
                headerClassName: 'text-left',
                accessor: "email",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            // {
            //     Header: "Quantity",
            //     headerClassName: 'text-left',
            //     accessor: "quantity",
            //     Cell: row=> Helpers.handleDisplay(row.value)
            // },
            {
                Header: "Quantity",
                headerClassName: 'text-left',
                accessor: "quantity",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Status",
                headerClassName: 'text-left',
                accessor: "_status",
                sortable: false,
                Cell: row=> Helpers.handleDisplay(row.original.is_cancelled ? 'Cancelled' : row.original.is_completed ? 'Completed' : !row.original.is_read ? 'Pending' : 'Processing')
            },
            // {
            //     Header: "Action",
            //     headerClassName: 'text-left',
            //     accessor: "email",
            //     Cell: row=> Helpers.handleDisplay(row.value)
            // },
            // {
            //     Header: "Total Cost",
            //     headerClassName: 'text-left',
            //     accessor: "total_cost",
            //     Cell: row=> Helpers.handleDisplay(row.value)
            // },
            // {
            //     Header: "Tracking No.",
            //     headerClassName: 'text-left',
            //     accessor: "tracking_no",
            //     Cell: row=> Helpers.handleDisplay(row.value)
            // },
            {
                Header: "Total Price",
                headerClassName: 'text-left',
                accessor: "total_item",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Tracking Number",
                headerClassName: 'text-left',
                accessor: "code",
                Cell: row=> <div>
                        <Input 
                            // className="input-sip form-control-sm-font-size input-sm input-height-xsm input-text-sm-pd talign-right"
                            type="text"
                            value={row.value||''}
                            style={{marginBottom:'5px'}}
                            onChange={(e)=>{
                                console.log(e)
                                const newData = this.state.data.map((dataRow, index)=>{
                                    if(index === row.index){
                                        return {...dataRow, code: e.target.value}
                                    } else {
                                        return {...dataRow}
                                    }
                                })
                                this.setState({data: newData})
                            }}
                        />
                        <Button color="primary" style={{float: 'right'}} onClick={()=>{this.updateOrder(row)}}><FaEdit/> Edit</Button>
                        {/* {Helpers.handleDisplay(row.value)} */}
                    </div>
            },
            {
                Header: "Action",
                headerClassName: 'text-left',
                accessor: "_actions",
                Cell: row=> {
                    return <div>
                        <Button color="danger" style={{marginBottom: '5px', display: 'block', width: '100%'}} onClick={()=> this.cancelOrder(row)}><FaTimes/> Cancel</Button>
                        <Button color="success" style={{width: '100%'}} onClick={()=> this.completeOrder(row)}><FaCheck/> Complete</Button>
                    </div>
                }
            },
        ],
    }

    prevColumn = this.state.columns || {}

    updateOrder = (row)=>{
        const body={
            code: row.value
        }
        API.updateOrder(body,row.original.id)
        .then((response)=>{
            TOAST.pop({message: "Sucessfully updated order"})
        }, err=> {
            TOAST.pop({message: err.message, type: "error"})
        })
    }

    cancelOrder = (row)=>{
        API.cancelOrder(row.original.id)
        .then((response)=>{
            TOAST.pop({message: "Sucessfully cancelled order"})
            this.fetchData()
        }, err=> {
            TOAST.pop({message: err.message, type: "error"})
        })
    }


    completeOrder = (row)=>{
        API.completeOrder(row.original.id)
        .then((response)=>{
            TOAST.pop({message: "Sucessfully completed order"})
            this.fetchData()
        }, err=> {
            TOAST.pop({message: err.message, type: "error"})
        })
    }

    selectActionToggled = (item) => {
        this.setState({
            itemData: item
        })
    }

    responseGetItems = (response) => { 
        const st = this.state
        response = response || {data:[]}
        response.data = response.data || []
        let configState = {
            data: response.data,
            total: response.count,
            totalPage: Math.ceil( (response.count || 0) / st.pageState.limit) 
        }
        // configState.totalPage = Math.ceil(configState.data.length / st.pageState.limit) 
        this.setState(configState)
    }

    fetchData = () => {

        // document.getElementsByClassName('rt-tbody')[0].scrollTop = 0;
        const that = this;
        const st = this.state
        this.toggleLoading(true)
        const params = { 
            // page: (st.pageState.page+1),
            // limit: st.pageState.limit,
            search: st.pageState.search,
            sort_id: st.pageState.sort_id || '',
            sort_desc: (!st.pageState.sort_id) ? '' :
                       (st.pageState.sort_desc || '').toString() === 'true' ? 'asc' : 'desc',
            is_read: st.filter === 'PENDING' ? 'false' : '',
            is_completed: st.filter === 'COMPLETED' ? 'true' : st.filter === 'PENDING' ? 'false' : '',
            is_cancelled: st.filter === 'CANCELLED' ? 'true' : st.filter === 'PENDING' ? 'false' : ''
        }
        console.log(params)
        API.getOrders({params})
            .then(response => { 
                this.responseGetItems(response) 
            }, err=> {
                this.setState({data:[]});
                TOAST.pop({message: err.message, type: 'error'})
            }).finally(()=>{
                this.setState({ searchLoading: false, apiParams: params })
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
                    sort_id: pageQs.sort_id || st.pageState.sort_id,
                    sort_desc: !!pageQs.sort_desc,
                } 
            },()=>{
                this.fetchData();
            })
        }
    } 

    componentWillUnmount() {
        this.setState({checkData: [], data: [] })
    }

    render() {
        const that = this
        const st=this.state;
        const original = st.selected || {}
        // st.data = st.data.map(d=> ({ ...d, check: st.checkData.filter(cData=>d.id===cData.id).length > 0 }))
        // st.columns = [
        //     ...this.prevColumn,
        // ]
        const messages = st.data.map((message, index)=> 
            <div key={index} style={{ background: 'white', padding: '10px', border: '2px solid #014401', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer'}} onClick={()=>this.props.history.push(`order/${message.id}`)}>
                <div style={message.is_read ? {marginBottom: '2px'} : {marginBottom: '2px', fontSize: '18px', fontWeight: '700'}}>
                    {message.is_read ? '' : <span style={{fontWeight: '400', fontSize: '14px', color: 'red'}}>*</span>} 
                    {message.first_name} {message.last_name} 
                    {<span style={{fontSize: '12px', color: 'gray', float: 'right'}}> ({moment(message.created).format('MMM DD YYYY')})</span>}
                </div>
                <div style={{fontSize: '12px'}}>{`(${gDp(message,'phone_number','')})`}</div>
                <div style={{borderBottom: '1px solid #014401', fontSize: '12px'}}>
                    {`${gDp(message,'email','')}`}
                    {<span style={{fontSize: '12px', color: 'gray', float: 'right'}}>Status: {!message.is_read ? 'Pending' : message.is_completed ? 'Completed' : 'Processing'}</span>}
                </div>
                <div style={message.is_read ? {} : {fontSize: '16px', fontWeight: '700'}}>- {message.message}</div>
            </div>)
        return (
            <div style={{margin: '0 5% 15px'}}> 
                <div className="pad-md">
                    <Row>
                        <Col className="margin-bottom-md">
                            <Row>
                                <Col md="3" className="margin-bottom-sm"  style={{marginBottom: '10px'}}>
                                    <SearchBar
                                        query={st.query}
                                        placeholder={'Search Order'}
                                        loading={st.searchLoading}
                                        didSearch={this.handleSearch}
                                        onChangeQuery={(e) => {this.setState({query: e.target.value})}}
                                    />  
                                </Col>
                                <Col className="margin-bottom-md">
                                    <div style={{marginBottom: '10px', position: 'relative'}}>
                                        <span style={{position: 'absolute', bottom: '5px', color: 'white'}}>Filter by:</span> 
                                        <Input style={{maxWidth: '150px', marginLeft: '70px', padding: '5px'}} type="select" name="filter" value={this.state.filter} onChange={(e)=>this.setState({filter: e.target.value},()=> this.fetchData())}>
                                            <option>ALL</option>
                                            <option>PENDING</option>
                                            {/* <option>PROCESSING</option> */}
                                            <option>COMPLETED</option>
                                            <option>CANCELLED</option>
                                        </Input>
                                    </div>
                                    {/* <hr style={{color: 'rgb(150,150,150,0.5)'}}/>
                                    {messages} */}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <ReactTable
                                        {...{
                                            ...Helpers.reactTableDefault({st, that: that}),
                                            // className: 'orders'
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    
                    <ConfirmModal
                        size="sm"
                        takeAction={()=>this.deleteUser(st.confirmUser)}
                        isOpen={st.isItemModalOpen}
                        isConfirmClick={st.isConfirmClick}
                        error={st.errorDelete}
                        itemData={original}
                        modalTitle={'Delete User'}
                        modalBody={ 
                            <p>Are you sure you want to delete user <strong>{st.confirmUser.username}</strong> ?</p>
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