import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom' 
import { Row, Col, Button } from 'reactstrap'
import { TOAST, DATE, gDp } from '../helpers/helpers'

import * as API from '../services/API'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment';
import Loader from './Loader'

import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import {FaCalendar} from 'react-icons/fa/'
import 'bootstrap-daterangepicker/daterangepicker.css';

const qs = require('query-string');
class Reports extends Component {
    urlSearch = qs.parse(this.props.history.location.search)
    state = {
        data:[],
        report:[],
        isLoading: true,
        average_report: [],
        pageState: {
            start_date: this.urlSearch.start_date,
            end_date: this.urlSearch.end_date
        },
    }

    fetchData = (id,is_average=false) => {
        if(id){
            this.getReport(id)
        } else {
            this.getAverage()
        }
    }

    getReport = (id) => {
        const st = this.state
        this.setState({isLoading: true})
        const params = {
            start_date: st.pageState.start_date || '',
            end_date: st.pageState.end_date || ''
        }
        !st.pageState.start_date && delete params.start_date
        !st.pageState.end_date && delete params.end_date
        API.getReport(params,id)
        .then((response)=>{
            this.setState({report: response.data})
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    getAverage = () => {
        const st = this.state
        this.setState({isLoading: true})
        const params = {
            start_date: st.pageState.start_date || '',
            end_date: st.pageState.end_date || ''
        }
        console.log(params, st)
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
            this.setState({report: report})
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    componentDidMount = () => {
        const {id} = this.props.match.params
        this.setState({isLoading: true})
        API.getReports()
        .then((response)=>{
            const newData = response.data.filter((report,index,self)=>
                index === self.findIndex((t) => (
                t.activity_id === report.activity_id
              ))
            )
            this.setState({data: newData})
            // this.setState({data: response.data})
        // this.fetchData(id)
        }, err => {
            TOAST.pop({message: err.message, type: 'error'})
        }).finally(()=> 
            this.setState({isLoading: false})
        )
    }

    componentWillReceiveProps = (newProps) => {
        const {id} = newProps.match.params
        this.setState({isLoading: true})
        if(!id) {
            this.getAverage()
        } else {
            this.getReport(id)
        }
    }

    handleDateRange = (event, picker) => {
        const that = this
        const st = this.state
        const {id} = this.props.match.params
        this.setState({
            pageState: {
                start_date: picker.startDate.format(DATE.DATE_DASH),
                end_date: picker.endDate.format(DATE.DATE_DASH)
            }
            },()=> {
                this.props.history.push(`?start_date=${picker.startDate.format(DATE.DATE_DASH)}&end_date=${picker.endDate.format(DATE.DATE_DASH)}`)
                if(id){
                    this.fetchData(id, picker.startDate.format(DATE.DATE_DASH))
                } else {
                    this.fetchData('', true)
                }
            })
    }

    render() {
        const st= this.state
        const pr = this.props
        const {id} = this.props.match.params
        const startDate = gDp(st.pageState,'start_date') ? moment(gDp(st.pageState,'start_date'),DATE.DATE_DASH) : ''
        const endDate = gDp(st.pageState,'end_date') ? moment(gDp(st.pageState,'end_date'),DATE.DATE_DASH) : ''
        const emptyDateCond = startDate==='' && endDate ===''

        const reports = [
            <Button color={!id ? "primary" : "secondary"} style={{width: '100%', marginBottom: '5px'}}
                onClick={()=>pr.history.push(`/reports`)}>
                Average Report
            </Button>
        ]
        st.data.map((report, pos)=> 
            reports.push(
            <Button key={report.id} color={id===report.activity_id ? "primary" : "secondary"} style={{width: '100%', marginBottom: '5px'}}
                onClick={()=>pr.history.push(`/report/${report.activity_id}`)}>
                {report.name}
            </Button>
        ))
        console.log(st)
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
        // const renderCustomAxisTick = ({ x, y, payload }) => {
        //     let path = '';
        
        //     switch (payload.value) {
        //         case 'Page A':
        //             path = 'M899.072 99.328q9.216 13.312 17.92 48.128t16.384 81.92 13.824 100.352 11.264 102.912 9.216 90.112 6.144 60.928q4.096 30.72 7.168 70.656t5.632 79.872 4.096 75.264 2.56 56.832q-13.312 16.384-30.208 25.6t-34.304 11.264-34.304-2.56-30.208-16.896q-1.024-10.24-3.584-33.28t-6.144-53.76-8.192-66.56-8.704-71.68q-11.264-83.968-23.552-184.32-7.168 37.888-11.264 74.752-4.096 31.744-6.656 66.56t-0.512 62.464q1.024 18.432 3.072 29.184t4.608 19.968 5.12 21.504 5.12 34.304 5.12 56.832 4.608 90.112q-11.264 24.576-50.688 42.496t-88.576 29.696-97.28 16.896-74.752 5.12q-18.432 0-46.08-2.56t-60.416-7.168-66.048-12.288-61.952-17.92-49.664-24.064-28.16-30.208q2.048-55.296 5.12-90.112t5.632-56.832 5.12-34.304 5.12-21.504 4.096-19.968 3.584-29.184q2.048-27.648-0.512-62.464t-6.656-66.56q-4.096-36.864-11.264-74.752-13.312 100.352-24.576 184.32-5.12 35.84-9.216 71.68t-8.192 66.56-6.656 53.76-2.56 33.28q-13.312 12.288-30.208 16.896t-34.304 2.56-33.792-11.264-29.696-25.6q0-21.504 2.048-56.832t4.096-75.264 5.632-79.872 6.656-70.656q2.048-20.48 6.144-60.928t9.728-90.112 11.776-102.912 13.824-100.352 16.384-81.92 17.92-48.128q20.48-12.288 56.32-25.6t73.216-26.624 71.168-25.088 50.176-22.016q10.24 13.312 16.896 61.44t13.312 115.712 15.36 146.432 23.04 153.6l38.912-334.848-29.696-25.6 43.008-54.272 15.36 2.048 15.36-2.048 43.008 54.272-29.696 25.6 38.912 334.848q14.336-74.752 23.04-153.6t15.36-146.432 13.312-115.712 16.896-61.44q16.384 10.24 50.176 22.016t71.168 25.088 73.216 26.624 56.32 25.6';
        //             break;
        //         case 'Page B':
        //             path = 'M662.528 451.584q10.24 5.12 30.208 16.384t46.08 31.744 57.856 52.736 65.024 80.896 67.072 115.2 64.512 154.624q-15.36 9.216-31.232 21.504t-31.232 22.016-31.744 15.36-32.768 2.56q-44.032-9.216-78.336-8.192t-62.976 7.68-53.248 16.896-47.616 19.968-46.08 16.384-49.664 6.656q-57.344-1.024-110.592-16.896t-101.376-32.256-89.6-25.088-75.264 4.608q-20.48 8.192-41.984 1.024t-38.912-18.432q-20.48-13.312-39.936-33.792 37.888-116.736 86.016-199.68t92.672-136.704 78.848-81.408 43.52-33.792q9.216-5.12 10.24-25.088t-1.024-40.448q-3.072-24.576-9.216-54.272l-150.528-302.08 180.224-29.696q27.648 52.224 53.76 79.36t50.176 36.864 45.568 5.12 39.936-17.92q43.008-30.72 80.896-103.424l181.248 29.696q-20.48 48.128-45.056 99.328-20.48 44.032-47.616 97.28t-57.856 105.472q-12.288 34.816-13.824 57.344t1.536 36.864q4.096 16.384 12.288 25.6z';
        //             break;
        //             // ...
        //         default:
        //             path = '';
        //     }
        
        //     return (
        //         <svg x={x - 12} y={y + 4} width={24} height={24} viewBox="0 0 1024 1024" fill="#666">
        //             <path d={path} />
        //         </svg>
        //     );
        // };
        // const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
        //     console.log(value)
        //     return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value}`}</text>;
        // };
        return (
            <div style={{margin: '0 5% 15px'}}> 
                <Row>
                    <Col sm="12" md="3">
                        {reports}
                    </Col>
                    <Col sm="12" md="9">
                        <Row>
                            <Col sm="12" md="3" style={{padding: '0', marginBottom: '10px'}}>
                                <div>
                                    <div className="react-date-range-picker input-sip">
                                        <DateRangePicker
                                            className="input-sip"
                                            // opens="left"
                                            {...(startDate) ? {startDate} : {}}
                                            {...(endDate) ? {endDate} : {}}
                                            ranges={{
                                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                                            }}
                                            onApply={this.handleDateRange}
                                            >
                                            <div>
                                                <Button type="button" className="pad-0 react-date-range-input" size='sm' color="link">
                                                    <i className="btn-icon">
                                                        <FaCalendar/>&nbsp;
                                                    </i>
                                                    {
                                                        emptyDateCond ? (
                                                            <span>All</span>
                                                        ) :
                                                        (
                                                            <span>
                                                                <span>{`${startDate.format("MM/DD/YYYY")} - ${endDate.format("MM/DD/YYYY")}`}</span>
                                                            </span>

                                                        )
                                                    }
                                                </Button>
                                            </div>
                                        </DateRangePicker>
                                        <Button style={{top:'-2px'}} size="sm" className="form-control-sm-font-size remove" color="link" onClick={(e)=>{
                                            this.setState({
                                                pageState: {
                                                    start_date: '',end_date: ''
                                                }
                                            })
                                            }
                                        }
                                        >
                                            <strong> X </strong>
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <ResponsiveContainer>
                            <BarChart
                                // width={800}
                                // height={300}
                                data={data}
                                margin={{
                                top: 30, right: 5, left: 5, bottom: 5,
                                }}
                            >
                                <XAxis dataKey="name" tickSize
                                    dy='25'/>
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="fw" fill="#8884d8"></Bar>
                                <Bar dataKey="bw" fill="#82ca9d"/>
                            </BarChart>
                        </ResponsiveContainer>
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