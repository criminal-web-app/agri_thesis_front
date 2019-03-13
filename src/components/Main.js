import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import * as Session from '../services/session'

import Header from './Header'
import About from './About'
import Users from './Users'
import Products from './Products'
import Reports from './Reports'
import Home from './Home'

import ProductAddEdit from './products/ProductAddEdit'
import UserAddEdit from './users/UserAddEdit'

class Main extends Component {
    state = {
        menuexpand: true,
        loading:false,
        isLoading: false
    }

    render() {
        const { menuexpand,isLoading } = this.state
        Session.setItem("currentPage",this.props.location.pathname)
        const has_token = Session.getToken()
        // if (has_token === null && this.props.location.pathname !== '/login') {
        //     // return <Redirect to="/"/>
        // }
        return (
            <div>
                <Header has_token={has_token}/>
                <div style={{ display: "block", background: 'rgb(242, 241, 201)', paddingTop: '15px' }} className={menuexpand ? 'content onexpand' : 'content'}> {/*Session.getRole() ? "block" : "none"*/}
                    <Switch>
                        <Route exact path="/home" render={()=>(
                            <Home/>
                        )}/>
                        <Route exact path="/about" render={()=>(
                            <About/>
                        )}/>
                        <Route exact path="/products" render={()=>(
                            <Products/>
                        )}/>
                        {has_token && <Route exact path="/users" render={()=>(
                            <Users/>
                        )}/>}
                        {has_token && <Route exact path="/product/create" render={()=>(
                            <ProductAddEdit method="Create" />
                        )}/>}
                        {has_token && <Route exact path="/product/update/:id" render={()=>(
                            <ProductAddEdit method="Update" />
                        )}/>}
                        {has_token && <Route exact path="/user/create" render={()=>(
                            <UserAddEdit method="Create" />
                        )}/>}
                        {has_token && <Route exact path="/user/update/:id" render={()=>(
                            <UserAddEdit method="Update" />
                        )}/>}
                        {has_token && <Route exact path="/reports" render={()=>(
                            <Reports/>
                        )}/>}
                        {has_token && <Route exact path="/report/:id" render={()=>(
                            <Reports/>
                        )}/>}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withRouter(Main);