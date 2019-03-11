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

class About extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        // ...DefaultState,
        titleHeader: 'Home',
        query: this.urlSearch.search || '',
        // pageState: {
        //     page: (parseInt(this.urlSearch.page || 0) > 0 ? (parseInt(this.urlSearch.page || 0) - 1 ) : 0),
        //     limit: parseInt(this.urlSearch.limit || 10),
        //     search: this.urlSearch.search || '',
        //     status: this.urlSearch.status || 'active',
        //     sort_id: this.urlSearch.sort_id || 'code',
        //     sort_desc: this.urlSearch.sort_desc,
        //     filter: {
        //         code: this.urlSearch.code,
        //         name: this.urlSearch.name,
        //         description: this.urlSearch.description
        //     }
        // }
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
            <div style={{margin: '0px 5%'}}> 
                <h5>HISTORY</h5>
                <p>
                    The National Institute of Molecular Biology and Biotechnology (BIOTECH) , 
                    formerly known as the National Institutes of Biotechnology and Applied Microbiology, 
                    was established on December 20, 1979 by the UP Board of Regents as a research and development institution
                    based at UP Los Baños. Letter of Instruction No. 1005 from then President Ferdinand E. Marcos
                    on March 1980 instructed the National Treasury to release P10 million out of the Energy Special Fund 
                    for the institute. BIOTECH originally served as an integrating mechanism to mobilize the 
                    various departments and disciplines in engineering, chemistry and applied microbiology for research, 
                    training, and extension.
                </p>
                <p>
                    BIOTECH serves as the national research and development (R&D) organization specializing in 
                    agricultural, environmental, food and feeds, and health biotechnology. The institute capitalizes on 
                    the use of the country's diverse collection of microorganisms, rich natural resources and 
                    agro-industrial waste and by-products to develop and advance alternative technologies and 
                    products towards improved agro-industrial productivity.
                </p>
                <br></br>

                <h5>VISION</h5>
                <p>
                    BIOTECH as a premier R & D institution for basic and applied researches on molecular biology and 
                    biotechnology addressing the needs related to agriculture, forestry, environment, energy and industry 
                    that will have positive impact to society.
                </p>
                <br></br>
                
                <h5>MISSION</h5>
                <p>To develop cost-effective and environment-friendly technologies for the production of goods and services 
                    that are comparable or better alternatives to conventional products for their use in the following 
                    sectors: agriculture, forestry, environment, energy and industry.
                </p>
                <br></br>

                <h5>GOALS</h5>
                <ul>
                    <li>To contribute to increased productivity and global competitiveness of commodities through the creation of high-value products, processes and services;</li>
                    <li>To lead in the use, protection and conservation of biodiversity especially microbial resources;</li>
                    <li>To be at the forefront in waste management research through biotechnology;</li>
                    <li>To develop a nationally recognized information and education center on biotechnology;</li>
                    <li>To fast track commercialization and transfer of biotechnologies through models, mechanisms and policy instruments; and,</li>
                    <li>To efficiently and effectively manage BIOTECH as a research, development, service, and extension (RDE) organization.</li>
                </ul>
            </div>
        ) ;
    }
}

export default withRouter(About);