import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { UncontrolledCarousel, Row, Col } from 'reactstrap'
import { Helpers, lS, DefaultState, TOAST, OPTIONS, gDp  } from '../helpers/helpers'

import * as API from '../services/API'
import moment from 'moment';
import Loader from './Loader'

import background from '../pic/background-green.jpeg';

// React table ref: https://react-table.js.org/#/story/readme

class Home extends Component {
    state = {
        data: [],
        isLoading: true,
        products: [],
        activities: []
    }

    componentDidMount = () => {
        const st = this.state
        const params = { 
            page: 1, 
            limit: 10,
        }
        API.getProducts({params})
        .then(response => { 
            this.setState({products: response.data}) 
        }, err=> {
            this.setState({products:[]});
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=>{
            this.setState({ isLoading: false, })
        })
        API.getActivities({params})
        .then(response => { 
            const activities = response.data.sort((a,b) => {return new Date(b.scheduled_date) - new Date(a.scheduled_date)})
            this.setState({activities: activities}) 
        }, err=> {
            this.setState({activities:[]});
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=>{
            this.setState({ isLoading: false, })
        })
    }

    render() {
        const st=this.state;

        // const items = [
        //     {
        //     //   src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        //         altText: 'Slide 1',
        //         caption: 'Slide 1',
        //         header: 'Slide 1 Header',
        //         className: 'Hello',
        //     },
        //     {
        //     //   src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        //         altText: 'Slide 2',
        //         caption: 'Slide 2',
        //         header: 'Slide 2 Header'
        //     },
        //     {
        //     //   src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        //         altText: 'Slide 3',
        //         caption: 'Slide 3',
        //         header: 'Slide 3 Header'
        //     }
        // ];
        const product = this.state.products.map((product)=>
            <Col key={product.id} md="6" sm="12"  style={{marginBottom: '10px'}}>
                <div md="12" style={{padding: '10px', border: '2px solid #014401',
                                                            borderRadius: '5px', background: 'white' }}>
                    <td style={{width: '150px', height: '150px', background: 'white'}}>
                        <img src={product.file} alt="No photo available" style={{height: '150px', width: '150px'}}></img>
                    </td>
                    <td style={{paddingLeft: '30px', verticalAlign: 'top'}}>
                        <div style={{color: '#014401'}}>
                            <h6>{product.name}</h6>
                            <div style={{fontSize: '12px', paddingLeft: '10px', lineHeight:'1'}}>Price: {Helpers.currency(product.price)}</div>
                            <div style={{paddingLeft: '5px'}}>{product.description}</div>
                        </div>
                    </td>
                </div>
            </Col>
        )
        const activities = st.activities.map((activity)=> {
            return {
                src: background,
                altText: activity.description,
                caption: moment(activity.scheduled_date).format('MMM DD YYYY'),
                header: activity.description,
            }
        })

        return(
            <div style={{margin: '0 10% 15px'}}> 
                {/* <div style={{height: '10%', width: '100%', margin: '0 auto'}}>
                    <UncontrolledCarousel items={items} />
                </div> */}
                <br/>
                <div>
                    <h4>Featured Products</h4>
                    <Row>
                        {product}
                    </Row>
                    {st.products.length>0 && <div style={{float: 'right'}}>
                        <NavLink to={'/products'}>See more...</NavLink>
                    </div>}
                </div>
                <br/>
                <h4>Activities</h4>
                <div style={{height: '10%', width: '100%', margin: '0 auto'}}>
                    <UncontrolledCarousel items={activities} />
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

export default withRouter(Home);