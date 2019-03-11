import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom'

import Login from './Login'
import Main from './Main';

import * as Session from '../services/session'

class App extends Component {
  state = {
    hasToken: false,
    isCurrent:false,
    hasPrevRoute: false
  }

  componentWillReceiveProps (nextProps) {
    var routeChanged = nextProps.location !== this.props.location
    this.setState({ hasPrevRoute: routeChanged })
  }

  componentDidMount () {
    const { hasPrevRoute } = this.state
    const { location : { pathname }, history } = this.props
    const urls = [
      '/',
      '/login',
      '/register',
      '/about',
      '/contact-us',
      '/users',
      '/products',
      '/reports'
      
    ]
    if (Session.getToken()) {
      this.setState(() => ({hasToken: true}))
      if (!urls.includes(`/${pathname.split('/')[1]}`)) {
        if (!urls.includes(`/${pathname.split('/')[1]}s`)) { // added s to match urls
          return hasPrevRoute ? history.goBack() : history.push(urls[0])
        }
      }
      if (pathname === '/' || pathname === '/login') {
        history.push(urls[0])
      }
    }
  }

  handleLogOut = () => {
    this.setState(() => ({hasToken: false}))
  }
  handleLogin = () => {
    this.setState(() => ({hasToken: true}))
  }
  render() {
    const { hasToken } = this.state
    return (
      <div style={{background:'#fff'}}>
        <Switch>
          <Route path="/"  render={() => (
            <Main />
          )}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)