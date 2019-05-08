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
            const latestReport = response.data[response.data.length-1]
            const newfw = JSON.parse(latestReport.avgfw)
            const newbw = JSON.parse(latestReport.avgbw)
            const fwRaw = [JSON.parse(latestReport.fw.split(":")[0]),JSON.parse(latestReport.fw.split(":")[1]),JSON.parse(latestReport.fw.split(":")[2])]
            const bwRaw = [JSON.parse(latestReport.bw.split(":")[0]),JSON.parse(latestReport.bw.split(":")[1]),JSON.parse(latestReport.bw.split(":")[2])]
            const newReport = [
                {
                    ...response.data[response.data.length-1],
                    fw1: newfw[0], bw1: newbw[0],
                    fw2: newfw[1], bw2: newbw[1],
                    fw3: newfw[2], bw3: newbw[2],
                    fw4: newfw[3], bw4: newbw[3],
                    fw5: newfw[4], bw5: newbw[4],
                    fw6: newfw[5], bw6: newbw[5],
                    fw7: newfw[6], bw7: newbw[6],
                    fw8: newfw[7], bw8: newbw[7],
                }
            ]
            this.setState({report: newReport, rawData: {fwRaw, bwRaw, newfw, newbw}},()=>{
                setTimeout(()=>{
                    window.print();
                    setTimeout(window.close, 0);
                }, 500)
            })
            // this.setState({report: response.data},()=>{
            //     setTimeout(()=>{
            //         window.print();
            //         setTimeout(window.close, 0);
            //     }, 500)
            // })
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
        const {id} = this.props.match.params
        const isReportId = !['/report/print/annual','/report/print/average'].includes(this.props.location.pathname)
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
                    <Col md={isReportId ? "10": "12"}>
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
                    {isReportId && <Col>
                        <div style={{background: 'white', textAlign: 'center', marginBottom: '5px', borderRadius: '5px'}}>Fresh Weight Test</div>
                        <table style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    {['','R1','R2','R3','AVERAGE'].map((head)=><th key={head}>{head}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {gDp(st,'rawData.fwRaw',[]).length ? [1,2,3,4,5,6,7,8].map((row, index)=> <tr key={index}>
                                    <td style={{textAlign: 'center'}}>T{index+1}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.fwRaw[0][index]}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.fwRaw[1][index]}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.fwRaw[2][index]}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.newfw[index].toFixed(2)}</td>
                                </tr>): ''}
                            </tbody>
                        </table>
                        <br/>
                        <div style={{background: 'white', textAlign: 'center', marginBottom: '5px', borderRadius: '5px'}}>Dry Weight Test</div>
                        <table style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    {['','R1','R2','R3','AVERAGE'].map((head)=><th key={head}>{head}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {gDp(st,'rawData.bwRaw',[]).length ? [1,2,3,4,5,6,7,8].map((row, index)=> <tr key={index}>
                                    <td style={{textAlign: 'center'}}>T{index+1}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.bwRaw[0][index]}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.bwRaw[1][index]}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.bwRaw[2][index]}</td>
                                    <td style={{textAlign: 'center'}}>{st.rawData.newbw[index].toFixed(2)}</td>
                                </tr>): ''}
                            </tbody>
                        </table>
                    </Col>}
                </Row>
            </div>
        );
    }
}

export default withRouter(PrintReport);