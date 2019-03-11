import React, { Component } from 'react'
import { Button, ListGroup, ListGroupItem, Label, FormGroup, Row, Col } from 'reactstrap'
import { InputGroup, InputGroupAddon } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation'
import { GenerateRandomString } from '../helpers/helpers'

import * as API from '../services/API'

import Modal from 'components/Modal'

class ListModal extends Component {

    state = {
        toast: {
            type: "",
            message: "",
            show: false
        }, 
        disableButton: false,
        searching:false, 
        searchKey: '',
        selected:[],
        original:[],
        model: {},
        paging: {
            page: 1,
            prevDisabled: true,
            nextDisabled: false
        } 
    }

    renderList = (array) => {
        const list = array.map((item, index) => {
            return <ListGroupItem key={item.id}>
                <FormGroup check>
                    <Label check className="check-container">
                        <AvInput 
                            name={item.id || item.name} 
                            type="checkbox" 
                            id={item.id || item.name}
                            checked={item.value}
                            onChange={this.checkUnCheckItems(item)} 
                            />{' '}
                        <span className="checkmark"></span>
                        <div className="checkbox-labels">
                            { item.name + ' - ' + item.label }
                        </div>
                    </Label>
                </FormGroup>
            </ListGroupItem>
        }) 

        return list
    }

    reorderData = (array) => { 
        let selected = []
        for (let i = 0; i < array.length; i++) {
            selected.push(array[i].id)
        } 
        return selected
    }

    initializeData = (list, checkedList) => { 
        let new_list = list
        for (let i=0; i<checkedList.length; i++) {
            for (let j=0; j<new_list.length; j++) {
                if (checkedList[i].id===new_list[j].id) {
                    new_list[j].value=true
                }
            }
        }
        const model = new_list.reduce((acc, step) => {
            return {
                ...acc,
                [step.id]: step.value
            }
        }, {})
        return model
    }

    handleSelectedValues = (checkedList) => {
        const { selected } = this.state
        const concatinated = selected.concat(checkedList)
        const newset = Array.from(new Set(concatinated))
        return newset
    }

    checkUnCheckItems = (item) => (e) => {
        const { selected } = this.state
        const { original } = this.props
        const new_item = {
            ...item,
            value: e.target.checked
        }
        let new_selected = selected
        if (new_item.value) {
            new_selected.push(new_item)
            const cat = new_selected.concat(new_selected)
            this.setState({ 
                selected:Array.from(new Set(cat)) 
            })
        } else {
            for (let i=0; i<new_selected.length; i++) {
                if (new_selected[i].id === item.id) {
                    new_selected.splice(i, 1)
                    break
                }
            }
            this.setState({ selected:new_selected })
        }
    }

    previousPage = () => {
        this.setState((oldState)=>{
            const currPage = (oldState.paging.page > 1) ? oldState.paging.page-1 : 1 
            return {
                paging: {
                    ...oldState.paging,
                    page: currPage 
                },
                searching:true
            }
        },
        ()=>{ 
            this.handlePrevNext()
        })
    }
    
    nextPage = () => {
        this.setState((oldState)=>{
            const currPage = (oldState.paging.page > 0) ? oldState.paging.page+1 : 1 
            return {
                paging: {
                    ...oldState.paging,
                    page: currPage 
                },
                searching: true
            }
        },
        ()=>{ 
            this.handlePrevNext()
        })
    }

    setPage = (val) => (e) => {
        const nPage = parseInt(val || e.target.value) || 'NaN'
        const cPage = isNaN(nPage)
        const currentPage = (cPage) ? 1 : nPage
        
        this.setState((oldState)=>{
            return {
                paging:{
                    ...oldState.paging,
                    page:currentPage 
                },
                searching:true
            }
        },
        ()=>{ 
            this.handlePrevNext()
        })
    }
    
    handlePrevNext = () => { 
        const { paging } = this.state 
        const { totalItems } = this.props
        const prev = (paging.page === 1) ? true : false
        const next = (paging.page === totalItems || totalItems === 1 ) ? true : false 
        const page = (paging.page > totalItems) ? 1 : paging.page
        this.setState({
            paging: {
                ...paging,
                page: page,
                prevDisabled:prev,
                nextDisabled:next
            },
            searching:true
        })
        this.props.handlePaging({ page:page, search: this.state.query })
    }

    handleSubmit = (e, error, values) => { 
        const { original, handleChanges, handlePaging } = this.props
        const { selected } = this.state

        const selected_ids = this.reorderData(selected)
        const original_ids = this.reorderData(original)
        
        this.setState({
            disableButton: true
        },()=>{
            handleChanges(selected_ids, original_ids) 
            this.resetState()
        })
    }

    search = (event, errors, values) => { 
        const { handlePaging } = this.props

        this.setState((oldState)=>{
            return {
                paging:{
                    ...oldState.paging,
                    page:1 
                },
                searching:true
            }
        }, ()=>{
            handlePaging({ 
                page:1, 
                limit:10, 
                search:values.searchKey 
            })        
        })
    }

    cancel = () => {
        this.props.toggle()
        this.resetState()
    }

    resetState = () => {
        const { handlePaging } = this.props
        this.setState({
            ...this.state,
            disableButton: false,
            searching:false,
            searchKey: '',
            selected:[],
            original:[],
            model: {},
            paging: {
                page: 1,
                prevDisabled: true,
                nextDisabled: false
            } 
        },()=>{
            handlePaging({ page:1, limit:10 })
        })
    }
    
    componentWillReceiveProps = (newProps) => { 
        this.setState({
            checkedList: newProps.checkedList,
            original: newProps.original,
            selected: [...Array.from(new Set(newProps.checkedList.concat(this.state.selected)))],
            searching:false
        })
    } 
    
    render() {
        const { isOpen, size, modalTitle, subject, list=[], checkedList=[], totalItems } = this.props
        const { paging, searchKey='', searching, disableButton } = this.state
        const new_selected = this.handleSelectedValues(checkedList) 
        const model = this.initializeData(list, new_selected)
        return (
            <div>
                <Modal
                    size={size}
                    isOpen={isOpen}
                    toggle={this.props.toggle}
                    onClosed={this.resetState}
                    modalTitle={modalTitle}
                    isLoading={searching}
                    modalBody={
                        (
                            <div>
                                <AvForm onSubmit={this.search}>
                                    <Row>
                                        <Col>
                                            <InputGroup> 
                                                <AvInput 
                                                    bsSize={"sm"}
                                                    placeholder={"Search " + ((subject) ? subject : 'Items')}
                                                    name="searchKey"
                                                    onChange={(e)=>{this.setState({query: e.target.value})}}
                                                    value={searchKey} />
                                                <InputGroupAddon addonType="append">
                                                    <Button 
                                                        size={"sm"} 
                                                        type="submit" 
                                                        color="secondary"> Search </Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </AvForm>
                                <br />
                                <AvForm onSubmit={this.handleSubmit} model={model} ref={c =>(this.form = c)} >
                                    <Row>
                                        <Col>
                                            <label><strong>Select {subject}: </strong></label>
                                        </Col>
                                        <Col align="right">
                                            <span>Page {totalItems > 0 ? paging.page : 0} of {totalItems}</span>
                                        </Col>
                                    </Row>
                                    <div>
                                        { list.length >= 1 && <ListGroup>
                                            { this.renderList(list) }
                                        </ListGroup> }
                                        { list.length <= 0 && <div 
                                            className="alert alert-secondary" 
                                            align="center" 
                                            role="alert">
                                            <span>
                                                <em>No {subject} Yet</em>
                                            </span>
                                        </div> }
                                    </div>
                                </AvForm>
                                <AvForm>
                                    <div align="center" style={{ marginTop:"15px" }}>
                                        <Button 
                                            size={"sm"} 
                                            onClick={this.previousPage} 
                                            disabled={paging.prevDisabled || totalItems===1}>{"<< Prev"}</Button>
                                        <AvInput 
                                            bsSize={"sm"}
                                            name="current_page"
                                            type="number"
                                            value={paging.page}
                                            min={1}
                                            onChange={this.setPage('')}
                                            disabled={totalItems===1}
                                            style={{
                                                width: "50px",
                                                display: "inline-block",
                                                margin: "0px 5px",
                                                height: "calc(1.6125rem + 3px)"
                                            }}
                                        />
                                        <Button 
                                            size={"sm"} 
                                            onClick={this.nextPage}
                                            disabled={paging.nextDisabled || totalItems===1}>{"Next >>"}</Button>
                                    </div>
                                </AvForm>
                            </div>
                        )
                    }
                    modalFooter={
                        (
                            <div className="width-max">
                                <Button onClick={this.cancel}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    className="float-right" 
                                    disabled={this.props.isFetching || disableButton}
                                    color="primary"
                                    onClick={()=>{this.form.submit()}} >
                                    Save
                                </Button>
                            </div>
                        )
                    }>
                </Modal> 
            </div>
        );
    }
}

export default ListModal;