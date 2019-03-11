import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button } from 'reactstrap'

import { Persist } from 'react-persist'

import * as API from '../services/API'
import * as Session from '../services/session'

// import { Helpers, lS, DefaultState, TOAST, OPTIONS  } from '../helpers/helpers'

import { FontAwesome } from '../icon.js'

// import qs from '../other_modules/query-string/index.js'

import Loader from './Loader'

const { FaEllipsisV } = FontAwesome
const qs = require('query-string');
// React table ref: https://react-table.js.org/#/story/readme

class Contact extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        // ...DefaultState,
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
        }
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

    changeKeyValue = (key, value) => {
        this.setState((oldState)=>({
            [key]: value || !oldState[key]
        }))
    }

    handleSearch = (e) => {
        const that = this;
        const st = this.state
        e.preventDefault()
        // Helpers.handlePage(that, {
        //     page: 0, 
        //     limit: st.pageState.limit, 
        //     search: st.query, 
        //     status: st.searchAddDrp.selected, 
        //     sort_id: st.pageState.sort_id, 
        //     sort_desc: !!st.pageState.sort_desc, 
        //     ...st.pageState.filter 
        // })
    }

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    componentDidMount = () => {
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

        return(
            <div> 
                Contact us!
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

export default withRouter(Contact);