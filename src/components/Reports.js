import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button } from 'reactstrap'
import { TOAST } from '../helpers/helpers'

import * as API from '../services/API'

import Loader from './Loader'

import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';


class Reports extends Component {
    state = {
        data:[],
        report:[],
        pageState: {
        },
    }


    componentDidMount = () => {
        const id = "24274392-7ee4-42d3-9d22-d471251d361e"
        if(id){
            this.retrieveReport(id)
        }
        API.getReports()
        .then((response)=>{
            this.setState({data: response.data})
            // this.handle
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    retrieveReport = (id) => {
        const params = {
            id: id
        }
        API.getReport(params, id)
        .then((response)=>{
            this.setState({report: response.data})
            // this.handle
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    render() {
        const st= this.state
        const pr = this.props
        console.log(st)
        const reports = st.data.map((report)=> 
            <Button color="secondary" style={{width: '100%', marginBottom: '5px'}}
                onClick={()=>pr.history.push(`/report/${report.id}`)}>
                {report.name}
            </Button>)
        // const data = [
        //     {
        //         name:
        //     },
        //     {
        //       name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
        //     },
        //     {
        //       name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
        //     },
        //     {
        //       name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
        //     },
        //     {
        //       name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
        //     },
        //     {
        //       name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
        //     },
        //     {
        //       name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
        //     },
        //     {
        //       name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
        //     },
        //   ];
        const data = st.report.length ? [
            {
                name: 1, fw: st.report[0].fw1, bw: st.report[0].bw1
            },
            {
                name: 2, fw: st.report[0].fw2, bw: st.report[0].bw2
            },
            {
                name: 3, fw: st.report[0].fw3, bw: st.report[0].bw3
            },
            {
                name: 4, fw: st.report[0].fw4, bw: st.report[0].bw4
            },
            {
                name: 5, fw: st.report[0].fw5, bw: st.report[0].bw5
            },
            {
                name: 6, fw: st.report[0].fw6, bw: st.report[0].bw6
            },
            {
                name: 7, fw: st.report[0].fw7, bw: st.report[0].bw7
            },
            {
                name: 8, fw: st.report[0].fw8, bw: st.report[0].bw8
            },
        ] : ''
        console.log(this.props)
        return (
            <div> 
                <Row>
                    <Col sm="12" md="3">
                        {reports}
                    </Col>
                    <Col>
                        <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="fw" fill="#8884d8" label="fw" />
                            <Bar dataKey="bw" fill="#82ca9d" />
                        </BarChart>
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

export default withRouter(Reports);