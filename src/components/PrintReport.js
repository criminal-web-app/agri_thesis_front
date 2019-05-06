import React, { Component } from 'react'
import { withRouter } from 'react-router-dom' 
import * as API from '../services/API'
import moment from 'moment';
import { gDp } from '../helpers/helpers'
import { Row, Col, Button } from 'reactstrap'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

class PrintReport extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state={
        report: [],
        annual_report: [],
        pageState: {
            start_date: this.urlSearch.start_date,
            end_date: this.urlSearch.end_date
        },
    }

    apiRetrieve = () => {
        const st = this.state
        const {id} = this.props.match.params
        const params = {
            start_date: st.pageState.start_date || '',
            end_date: st.pageState.end_date || ''
        }
        !st.pageState.start_date && delete params.start_date
        !st.pageState.end_date && delete params.end_date
        console.log('Hello')
        API.getReport(params,id)
        .then((response)=>{
            this.setState({report: response.data},()=>{
                setTimeout(()=>{
                    window.print();
                    setTimeout(window.close, 0);
                }, 500)
            })
        }, err => {
            
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    apiAverage = () => {
        const st = this.state
        const {id} = this.props.match.params
        const params = {
            start_date: st.pageState.start_date || '',
            end_date: st.pageState.end_date || ''
        }
        !st.pageState.start_date && delete params.start_date
        !st.pageState.end_date && delete params.end_date
        API.getAverageReports(params)
        .then((response)=>{
            const report = [{...response.data,
                fw1: response.data.avg_fw1, bw1: response.data.avg_bw1,
                fw2: response.data.avg_fw2, bw2: response.data.avg_bw2,
                fw3: response.data.avg_fw3, bw3: response.data.avg_bw3,
                fw4: response.data.avg_fw4, bw4: response.data.avg_bw4,
                fw5: response.data.avg_fw5, bw5: response.data.avg_bw5,
                fw6: response.data.avg_fw6, bw6: response.data.avg_bw6,
                fw7: response.data.avg_fw7, bw7: response.data.avg_bw7,
                fw8: response.data.avg_fw8, bw8: response.data.avg_bw8,
            }]
            this.setState({report: report},()=>{
                setTimeout(()=>{
                    window.print();
                    setTimeout(window.close, 0);
                }, 500)
            })
        }, err => {
            
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    apiAnnual = () => {
        const st = this.state
        this.setState({isLoading: true})
        console.log('isAnnual')
        API.getAnnualReport()
        .then((response)=>{
            const report = response.data.map((months)=> {return {...months, Month: month[months.Month-1]}})
            
            this.setState({annual_report: report})
        }, err => {
            // TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false},()=>{
                setTimeout(()=>{
                    window.print();
                    setTimeout(window.close, 0);
                }, 500)
            })
        )
    }

    componentDidMount(){
        const pr = this.props
        const {id} = this.props.match.params
        console.log(pr)
        console.log(pr.location.pathname, pr.location.pathname==='/report/print/average')
        if(pr.location.pathname==='/report/print/annual'){
            this.apiAnnual()
        } else if(pr.location.pathname==='/report/print/average'){
            this.apiAverage()
        } else {
            this.apiRetrieve()
        }
    }

    render() {
        const st = this.state;
        const data = st.report.length ? [
            {
                name: 'T1', fw: st.report[0].fw1, bw: st.report[0].bw1
            },
            {
                name: 'T2', fw: st.report[0].fw2, bw: st.report[0].bw2
            },
            {
                name: 'T3', fw: st.report[0].fw3, bw: st.report[0].bw3
            },
            {
                name: 'T4', fw: st.report[0].fw4, bw: st.report[0].bw4
            },
            {
                name: 'T5', fw: st.report[0].fw5, bw: st.report[0].bw5
            },
            {
                name: 'T6', fw: st.report[0].fw6, bw: st.report[0].bw6
            },
            {
                name: 'T7', fw: st.report[0].fw7, bw: st.report[0].bw7
            },
            {
                name: 'T8', fw: st.report[0].fw8, bw: st.report[0].bw8
            },
        ] : ''
        const is_annual = this.props.location.pathname==='/report/print/annual'
        console.log(st.report, this.props, st)
        return (
            <div>
                <div style={{}}>
                    <strong style={{fontSize: '24px'}}><span style={{fontSize: '36px'}}>{st.report.length ? st.report[0].name : st.annual_report.length ? 'Annual' : 'Average'}</span>&nbsp;{st.pageState.start_date ? `(${moment(st.pageState.start_date).format('MMMM DD YYYY')}` : ''} {st.pageState.end_date ? `- ${moment(st.pageState.end_date).format('MMMM DD YYYY')})` : ''}</strong>
                </div>
                <Row>
                    <Col md="10">
                        {is_annual ? 
                            <ResponsiveContainer>
                                <BarChart
                                    // width={800}
                                    // height={300}
                                    data={st.annual_report}
                                    margin={{
                                    top: 30, right: 15, left: 5, bottom: 15,
                                    }}
                                >
                                    <XAxis dataKey="Month" tickSize
                                        dy='25'/>
                                    <YAxis label={{ value: 'Average Weight', angle: -90, position: 'insideLeft' }}/>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* <Tooltip /> */}
                                    <Legend />
                                    <Bar name="Fresh Weight Test" dataKey="avg_fw" fill="#82ca9d"/>
                                    <Bar name="Dry Weight Test" dataKey="avg_bw" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>:
                            <ResponsiveContainer>
                                <BarChart
                                    // width={800}
                                    // height={300}
                                    data={data}
                                    margin={{
                                    top: 30, right: 15, left: 5, bottom: 15,
                                    }}
                                >
                                    <XAxis dataKey="name" tickSize
                                        dy='25'/>
                                    <YAxis label={{ value: 'Average Weight', angle: -90, position: 'insideLeft' }}/>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* <Tooltip /> */}
                                    <Legend />
                                    <Bar name="Fresh Weight Test" dataKey="fw" fill="#82ca9d"/>
                                    <Bar name="Dry Weight Test" dataKey="bw" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    </Col>
                    <Col md="2">
                        <table style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    {['','R1','R2','R3','AVERAGE'].map((head)=><th key={head}>{head}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>T1</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(PrintReport);