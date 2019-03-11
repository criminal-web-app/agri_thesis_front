import React, { Component } from 'react'
import { withRouter, NavLink, } from 'react-router-dom' 
import { Row, Col, Navbar, Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, Button} from 'reactstrap'
import * as API from '../services/API'

import Loader from './Loader'
import Login from './Login'

import * as Session from '../services/session'
import { TOAST } from '../helpers/helpers';
const qs = require('query-string');

class Header extends Component {
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
        }
    }

    prevColumn = this.state.columns || {}

    selectActionToggled = (item) => {
        this.setState({
            itemData: item
        })
    }

    toggleLoading = (flag) => {
        this.setState(oldState => ({searchLoading: flag}))
    }
    toggleButton = (path) => {
        this.props.history.push(path)
    }

    handleLogOut = () => {
        API.logout()
        .then((response)=> {
            Session.removeUser()
            this.setState({has_token: false})
            this.props.history.push('/')
        },err =>{
            TOAST.pop({message: err.message, type: 'error'})
        })
    }

    render() {
        const st=this.state;
        const has_token = Session.getToken()
        return(
            <div className="mbot-xs-15 header"> 
                <Row style={{background: 'rgb(252, 168, 108)', margin: 'auto'}}>
                    <Col>
                        <Navbar>
                            <NavLink className="headerNav" to="/">BIO-N</NavLink>
                            <NavLink className="headerNav" to="/">Home</NavLink>
                            <NavLink className="headerNav" to="/about">About</NavLink> 
                            <NavLink className="headerNav" to="/products">Products</NavLink>  
                            {has_token && <NavLink className="headerNav" to="/users">Users</NavLink> }
                            {has_token && <NavLink className="headerNav" to="/reports">Reports</NavLink> }
                            {/* <NavLink className="headerNav" to="/contact-us">Contact Us</NavLink> */}
                                <Nav className="ml-auto" navbar>
                                    {has_token ? 
                                        <Button color="danger" onClick={()=>this.handleLogOut()} style={{padding: '1px 6px'}}>
                                            Log out
                                        </Button>
                                        :<UncontrolledDropdown>
                                            <DropdownToggle style={{padding: '1px 6px'}}>
                                                Login
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <Login/>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    }
                                </Nav>
                        </Navbar>
                    </Col>
                </Row>
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