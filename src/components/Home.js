import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Button } from 'reactstrap'

import * as API from 'services/API'
import { Helpers, lS, DefaultState, TOAST, OPTIONS  } from 'helpers/helpers'
import { FontAwesome } from 'icon.js'

import Loader from 'components/Loader'


// React table ref: https://react-table.js.org/#/story/readme

class HomePage extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data: []
    }

    componentDidMount = () => {
        API.get
    }

    render() {
        const that = this
        const st=this.state;

        return(
            <div> 
                Home!
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

export default withRouter(Home);