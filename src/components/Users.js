import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button } from 'reactstrap'
import ReactTable from 'react-table'

import * as API from '../services/API'
import * as Session from '../services/session'

import { Helpers, lS, DefaultState, TOAST, OPTIONS, gDp, DATE_FORMAT  } from '../helpers/helpers'

import SearchBar from './SearchBar.js'
import ConfirmModal from '../modals/ConfirmModal'

import {FaTrashAlt, FaEdit} from 'react-icons/fa/'
import Loader from './Loader'

const qs = require('query-string');

// React table ref: https://react-table.js.org/#/story/readme

class Users extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data: [],
        query: this.urlSearch.search || '',
        confirmUser: {username: ''},
        pageState: {
            page: (parseInt(this.urlSearch.page || 0) > 0 ? (parseInt(this.urlSearch.page || 0) - 1 ) : 0),
            limit: parseInt(this.urlSearch.limit || 10),
            search: this.urlSearch.search || '',
        },
        columns: [
            {
                Header: "ID",
                headerClassName: 'text-left',
                accessor: "id",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Username",
                headerClassName: 'text-left',
                accessor: "username",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Name",
                headerClassName: 'text-left',
                accessor: "last_name",
                Cell: row=> Helpers.handleDisplay(((row.original.last_name) ? (row.original.last_name+', ') : '') + row.original.first_name || '')
            },
            {
                Header: "Email",
                headerClassName: 'text-left',
                accessor: "email",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Phone Number",
                headerClassName: 'text-left',
                accessor: "phone_number",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Address",
                headerClassName: 'text-left',
                accessor: "address",
                Cell: row=> Helpers.handleDisplay(row.value)
            },{
                Header: "Date",
                headerClassName: 'text-left',
                accessor: "created",
                Cell: row=> Helpers.handleDate(row.value, DATE_FORMAT)
            },
            {
                Header: "Role",
                headerClassName: 'text-left',
                accessor: "role",
                Cell: row=> Helpers.handleDisplay(row.value)
            },
            {
                Header: "Action",
                headerClassName: 'text-right grid',
                accessor: "_actions_",
                width: 70,
                Cell: row=> {return <div>
                        <Button color="danger" onClick={()=>this.setState({isItemModalOpen: true, confirmUser: row.original})}
                            className="form-control-sm-font-size input-text-sm-pd input-height-xsm button-adjust-padding-sm">
                            <FaTrashAlt/>
                        </Button>&nbsp;
                        <Button color="primary" onClick={()=>this.props.history.push(`/user/update/${row.original.id}`)}
                            className="form-control-sm-font-size input-text-sm-pd input-height-xsm button-adjust-padding-sm">
                            <FaEdit/>
                        </Button>
                    </div>
                }
            }
        ],
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
            total: response.count,
            totalPage: Math.ceil( (response.total || 0) / st.pageState.limit) 
        }
        // configState.totalPage = Math.ceil(configState.data.length / st.pageState.limit) 
        this.setState(configState)
    }
    
    deleteUser = (row) => {
        const id = row.id
        API.deleteUser(row, id)
        .then((response)=>{
            TOAST.pop({message: 'Successfully deleted user!'})
            this.setState({isItemModalOpen: false, isConfirmClick: false})
            this.fetchData()
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
            this.setState({isConfirmClick: false})
        })
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

        API.getUsers({params})
            .then(response => { 
                console.log(response)
                this.responseGetItems(response) 
            }, err=> {
                this.setState({data:[]});
                TOAST.pop({message: err.message, type: 'error'})
            }).finally(()=>{
                this.setState({ searchLoading: false, apiParams: params })
            })
    }

    changeKeyValue = (key, value) => {
        this.setState((oldState)=>({
            [key]: value || !oldState[key]
        }))
    }

    handleSearch = (e) => {
        console.log('a')
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
        st.data = st.data.map(d=> ({ ...d, check: st.checkData.filter(cData=>d.id===cData.id).length > 0 }))
        st.columns = [
            ...this.prevColumn,
        ]
        console.log(st)
        
        return (
            <div style={{margin: '0 5% 15px'}}> 
                <div className="pad-md">
                    <Row>
                        <Col className="margin-bottom-md">
                            <Row>
                                <Col md="6" lg="3" className="margin-bottom-sm">
                                    <SearchBar
                                        query={st.query}
                                        placeholder={'Search User'}
                                        loading={st.searchLoading}
                                        didSearch={this.handleSearch}
                                        onChangeQuery={(e) => {this.setState({query: e.target.value})}}
                                    />  
                                </Col>
                                <Col align="right">
                                    <Button color="primary" onClick={()=>this.props.history.push('/user/create')}>
                                        Add User
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
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

export default withRouter(Users);