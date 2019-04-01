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
import { IoIosArrowDropleftCircle } from 'react-icons/io/'
import Loader from './Loader'

const moment = require('moment');
const qs = require('query-string');

// React table ref: https://react-table.js.org/#/story/readme

class OrderDetails extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data: [],
        isLoading: true
    }

    prevColumn = this.state.columns || {}

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    componentDidMount = () => {
        this.apiRetrieve()
    }

    completeOrder = () => {
        const {id} = this.props.match.params
        this.setState({isLoading: true})
        API.completeOrder(id)
        .then((response)=> {
            this.props.history.goBack()
            TOAST.pop({message: response.message})
        }, err=> {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(
            this.setState({isLoading: false})
        )
    }

    apiRetrieve = () => {
        const {id} = this.props.match.params
        API.getOrder(id)
        .then((response)=> {this.setState({data: response.data})
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> this.setState({isLoading: false}))
    }

    render() {
        const that = this
        const st=this.state;
        const original = st.selected || {}
        const {data} = this.state
        return (
            <div style={{margin: '0 5% 15px'}}> 
                <div className="pad-md">
                    <label 
                        className="lead"
                        onClick={()=>this.props.history.goBack()}
                        style={{
                            paddingLeft: '15px',
                            marginTop: '1rem',
                            color: '#374144',
                            cursor: 'pointer',
                        }} > 
                        <IoIosArrowDropleftCircle  /> Back 
                        {/* <Button 
                            color="primary" 
                            onClick={this.goBack} 
                            style={{ 
                                position: 'absolute',
                                top: '126px'
                            }}>Go back</Button> */}
                    </label>
                    <Row>
                        <Col className="margin-bottom-md">
                            <div style={{ padding: '10px', border: '2px solid #014401', borderRadius: '5px', background: 'white', marginBottom: '10px',}}>
                                <div style={{marginBottom: '2px', fontSize: '18px', fontWeight: '700'}}>
                                    {gDp(data,'first_name', '')} {gDp(data,'last_name','')}
                                    {<span style={{fontSize: '12px', color: 'gray', float: 'right'}}> ({moment(data.create).format('MMM DD YYYY')})</span>}
                                </div>
                                <div style={{fontSize: '12px'}}>{`(${gDp(data,'phone_number','')})`}</div>
                <div style={{borderBottom: '1px solid #014401', fontSize: '12px'}}>{`${gDp(data,'email','')}`}</div>
                                <div style={{marginTop: '20px'}}>{gDp(data,'message','')}</div>
                                <br/>
                                <Button name="complete_order" color="primary" onClick={()=>this.completeOrder()}>Complete Order</Button>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                    </Row>
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

export default withRouter(OrderDetails);