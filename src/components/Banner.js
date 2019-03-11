import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Jumbotron, Container, Button, Alert } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import * as Session from 'services/session'
import { IoIosArrowDropleftCircle } from 'react-icons/io/'
import * as API from 'services/API'
import moment from "moment"

class Banner extends Component {

    constructor (props) {
        super(props)
        this.state = {
            showAlert:false,
            msgOutlet:null,
            dateUpdated:""
        }
        this.goBack = this.goBack.bind(this)
    } 

    goBack () {
        const { history, prevLocation, goBack=-1 } = this.props
        if (prevLocation) {
            return history.push(prevLocation)
        }
        history.go(goBack)
    }

    render() {
        const { header, contents, hasBack = false } = this.props
        const isFranchiseOwner = Session.getRole() === "FRANCHISE_OWNER"
        const isSuperAdmin = Session.getRole() === "SUPER_ADMIN"
        const {showAlert,msgOutlet,dateUpdated} = this.state

        return (
            <div>
                <Jumbotron className="pad-md">
                    {/* <Container> */}
                        <h1 className="display-3">{header}</h1>
                        {/* <p className="lead">{contents}</p> */}
                    {/* </Container> */}
                </Jumbotron>
                { hasBack && (
                    <label 
                        className="lead"
                        onClick={this.goBack}
                        style={{
                            marginLeft: '2rem',
                            marginTop: '1rem',
                            color: '#374144',
                            cursor: 'pointer',
                        }} > 
                        <IoIosArrowDropleftCircle  /> Go Back 
                        {/* <Button 
                            color="primary" 
                            onClick={this.goBack} 
                            style={{ 
                                position: 'absolute',
                                top: '126px'
                            }}>Go back</Button> */}
                    </label>
                )}
                {showAlert === false ? false : isFranchiseOwner ? false : isSuperAdmin ? false : true  && ( 
                    <Container>
                        <Alert color="primary talign-center">
                            {msgOutlet}<br/>
                            {moment(dateUpdated).format("MMMM D, ddd hh:mm a")}
                        </Alert>
                    </Container>
                )}
            </div>
        );
    }
}

Banner.propTypes = {
    header: PropTypes.string.isRequired,
    contents: PropTypes.string,
    prevLocation: PropTypes.string
};

export default withRouter(Banner);