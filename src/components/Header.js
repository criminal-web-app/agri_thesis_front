import React, { Component } from 'react'
import { withRouter, NavLink, } from 'react-router-dom' 
import { Row, Col, Navbar, Nav, Dropdown, DropdownToggle, DropdownMenu, Input, Button} from 'reactstrap'
import * as API from '../services/API'

import Loader from './Loader'
import Login from './Login'

import { TOAST } from '../helpers/helpers';

import ConfirmModal from '../modals/ConfirmModal'
import * as Session from '../services/session'
import {FaCaretLeft, FaCaretDown } from 'react-icons/fa/'

import moment from 'moment';

import logo from './Bio-N.ico'

const qs = require('query-string');
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
class Header extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        titleHeader: 'Home',
        query: this.urlSearch.search || '',
        password: '',
        confirm_pass: '',
        dropdownOpen: false,
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

    changeKeyValue = (key, value) => {
        this.setState((oldState)=>({
            [key]: value || !oldState[key]
        }))
    }

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    changePassword = () => {
        const {id} = Session.getUser()
        const body = {
            password: this.state.password,
            confirm_password: this.state.confirm_pass
        }
        this.setState({isConfirmClick: true})
        API.changePassword(body,id)
        .then((response)=> {
            this.setState({password: '', confirm_pass: '', isChangePassModalOpen: false})
        },err =>{
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> {
            this.setState({isConfirmClick: false})
        })
    }

    render() {
        const st=this.state;
        const user = Session.getUser()
        const has_token = this.state.has_token || Session.getToken() || user
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() +1
        const lastDay = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('DD');
        const reportStartQuery = moment(date.getMonth())
        console.log(month, year)
        // console.log(reportStartQuery)
        return(
            <div className="header"> 
                <Row style={{background: '#049372', margin: 'auto'}}>
                    <Col>
                        <Navbar>
                            <NavLink className="headerNav" exact to="/" activeStyle={{textDecoration: 'underline'}}><img src={logo} alt="logo" style={{height: '24px', width: '24px'}}></img>BIO-N</NavLink>
                            {/* <NavLink className="headerNav" to="/home" activeStyle={{textDecoration: 'underline'}}>Home</NavLink> */}
                            <NavLink className="headerNav" to="/about" activeStyle={{textDecoration: 'underline'}}>About</NavLink> 
                            <NavLink className="headerNav" to="/products" activeStyle={{textDecoration: 'underline'}}>Products</NavLink>  
                            {has_token && <NavLink className="headerNav" to="/users" activeStyle={{textDecoration: 'underline'}}>Users</NavLink> }
                            {has_token && <NavLink className="headerNav" to="/orders" activeStyle={{textDecoration: 'underline'}}>Orders</NavLink> }
                            {has_token && <NavLink className="headerNav" to={`/report/annual?start_date=${year}-${month}-01&end_date=${year}-${month}-${lastDay}`} activeStyle={{textDecoration: 'underline'}}>Reports</NavLink> }
                                <Nav className="ml-auto" navbar>
                                        <Dropdown isOpen={this.state.dropdownOpen} toggle={()=>this.toggle()}>
                                            <DropdownToggle style={{padding: '1px 6px', background: 'transparent', border: 'none'}}>
                                                {has_token ? <div>{user.username} {!this.state.dropdownOpen ? <FaCaretDown/> : <FaCaretLeft/>}</div> : 'Login'}
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <Login that={this}/>
                                            </DropdownMenu>
                                        </Dropdown>
                                </Nav>
                        </Navbar>
                    </Col>
                </Row>
                <ConfirmModal
                    size="sm"
                    takeAction={(e)=> this.changePassword()}
                    isOpen={st.isChangePassModalOpen || false}
                    disableConfirmButton={st.password.length<6 || st.confirm_pass.length<6 || st.password !== st.confirm_pass}
                    isConfirmClick={st.isConfirmClick}
                    modalTitle={'Change Password'}
                    disabledConfirmFocus={true}
                    modalBody={  
                        <div>
                            <div align="center" className="margin-bottom-md" style={{marginBottom: '5px'}} >
                                <Input type="password" className="form-control-sm-font-size mtop-sm-10" value={st.password||''} 
                                    placeholder="Password"
                                    onChange={(e)=>{
                                        this.setState({password: e.target.value})
                                    }}>
                                </Input>
                            </div>
                            <div align="center" className="margin-bottom-md" >
                                <Input id="receiver" placeholder="Confirm password" type="password" className="form-control-sm-font-size" 
                                onChange={(e) =>this.setState({confirm_pass: e.target.value})}
                                value={st.confirm_pass||''} />
                            </div>
                        </div>
                    }
                    toggle={
                        () => {
                            this.changeKeyValue("isChangePassModalOpen")
                        }
                    }
                />
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

export default withRouter(Header);