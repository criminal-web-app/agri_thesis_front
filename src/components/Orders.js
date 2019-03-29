import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button, Input } from 'reactstrap'
import ReactTable from 'react-table'

import * as API from '../services/API'
import * as Session from '../services/session'

import { Helpers, lS, DefaultState, TOAST, OPTIONS, gDp, DATE_FORMAT  } from '../helpers/helpers'

import SearchBar from './SearchBar.js'
import ConfirmModal from '../modals/ConfirmModal'

import {FaTrashAlt, FaEdit} from 'react-icons/fa/'
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
        pageState: {
            page: (parseInt(this.urlSearch.page || 0) > 0 ? (parseInt(this.urlSearch.page || 0) - 1 ) : 0),
            limit: parseInt(this.urlSearch.limit || 10),
            sort_id: this.urlSearch.sort_id || 'created',
            sort_desc: this.urlSearch.sort_desc || 'desc',
            search: this.urlSearch.search || '',
        },
        columns: [
            {
                Header: "Name",
                headerClassName: 'text-left',
                accessor: "last_name",
                Cell: row=> Helpers.handleDisplay(((row.original.last_name) ? (row.original.last_name+', ') : '') + row.original.first_name || '')
            },
            {
                Header: "Date",
                headerClassName: 'text-left',
                sortable: false,
                accessor: "created",
                Cell: row=> Helpers.handleDate(row.value, DATE_FORMAT)
            },
            {
                Header: "Role",
                headerClassName: 'text-left',
                accessor: "role",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
        ],
    }

    prevColumn = this.state.columns || {}

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
                       (st.pageState.sort_desc || '').toString() === 'true' ? st.pageState.sort_desc : 'desc',
            is_read: st.filter === 'READ' ? 'true' : st.filter ==='UNREAD' ? 'false' : '',
            is_completed: st.filter === 'COMPLETE' ? 'true' : '',
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
        const messages = st.data.map((message)=> 
            <div key={message.id} style={{marginBottom: '10px', borderBottom: '1px solid rgb(150,150,150,0.5)', cursor: 'pointer'}} onClick={()=>this.props.history.push(`order/${message.id}`)}>
                <div style={message.is_read ? {marginBottom: '2px'} : {marginBottom: '2px', fontSize: '18px', fontWeight: '700'}}>
                    {message.is_read ? '' : <span style={{fontWeight: '400', fontSize: '14px', color: 'red'}}>*</span>} 
                    {message.first_name} {message.last_name} 
                    {<span style={{fontSize: '12px', color: 'gray', float: 'right'}}> ({moment(message.created).format('MMM DD YYYY')})</span>}
                </div>
                <div style={message.is_read ? {} : {fontSize: '16px', fontWeight: '700'}}>- {message.message}</div>
            </div>)
        return (
            <div style={{margin: '0 5% 15px'}}> 
                <div className="pad-md">
                    <Row>
                        <Col className="margin-bottom-md">
                            <div style={{marginBottom: '10px', position: 'relative'}}>
                                <span style={{position: 'absolute', bottom: '0'}}>Filter by:</span> 
                                <Input style={{maxWidth: '150px', marginLeft: '70px'}} type="select" name="filter" value={this.state.filter} onChange={(e)=>this.setState({filter: e.target.value},()=> this.fetchData())}>
                                    <option>All</option>
                                    <option>UNREAD</option>
                                    <option>READ</option>
                                    <option>COMPLETE</option>
                                </Input>
                            </div>
                            <hr style={{color: 'rgb(150,150,150,0.5)'}}/>
                            {/* <Row>
                                <Col md="3" className="margin-bottom-sm"  style={{marginBottom: '10px'}}>
                                    <SearchBar
                                        query={st.query}
                                        placeholder={'Search Order'}
                                        loading={st.searchLoading}
                                        didSearch={this.handleSearch}
                                        onChangeQuery={(e) => {this.setState({query: e.target.value})}}
                                    />  
                                </Col>
                            </Row> */}
                            {messages}
                            {/* <Row>
                                <Col>
                                    <div className="text-left text-lg-right text-md-right">
                                        <strong>Total: </strong>
                                        { st.searchLoading ? '...' : (st.total || 0)} 
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="user">
                                    <ReactTable
                                        {...{
                                            ...Helpers.reactTableDefault({st, that: that}),
                                        }}
                                    />
                                </Col>
                            </Row> */}
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