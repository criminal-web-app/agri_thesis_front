import React, { Component } from 'react';

import { Row, Col, Button } from 'reactstrap';
import Img from 'react-image'
import { SyncLoader } from 'react-spinners'
import { Helpers } from 'helpers/helpers';

import { FontAwesome } from 'icon.js';
import { debug } from 'util';

import {FaPencilAlt} from 'react-icons/fa/'
const { FaTrashO, FaRotateLeft } = 'react-icons/md/';

function ImageRender({itemList={}}) {
    return (
        <Img src={itemList.url} className="images" 
            unloader={<Img 
                        src="http://placehold.jp/c2c7cc/ffffff/150x150.png?text=No%20Image" className="images" 
                        loader={
                            <SyncLoader
                                size={4}
                                loading={true}>
                            </SyncLoader>
                        }
                        unloader={<Img 
                                    src="http://placehold.jp/c2c7cc/ffffff/150x150.png?text=No%20Image" className="images"/> }
                        />
            } 
            loader={
                <SyncLoader
                    size={4}
                    loading={true}>
                </SyncLoader>
            }/>
    )
}

class ListDetails extends Component {
    render() {
        const pr = this.props;
        const { original, listDetails={} } = this.props
        const { data=[], title, subTitle, editName, confirmName, haveBorder, showStatus, statusName } = listDetails;
        const statusValue = original[statusName || 'status'] || '';
        return (
            <div className={ haveBorder ? 'contain-details': '' }>
                <Row>
                    <Col md="6">
                        <div className={ subTitle ? 'margin-bottom-sm': '' }>
                            <h5 className={ subTitle ? 'no-margin-bottom': '' } >
                                {
                                    typeof title === "function" ? (title({ original: original })) : (title || 'Details') 
                                }
                                { showStatus && (<span> { Helpers.handleStatus(statusValue, { className: 'custom-badge-header'}) } </span> ) }
                            </h5>
                            {subTitle && (
                                <strong>{ 
                                    typeof title === "function" ? (subTitle({ original: original })) : (subTitle) 
                                }</strong>
                            )}
                        </div>
                    </Col>
                    <Col md="6">
                        <div className="text-left text-lg-right text-md-right">
                            { (statusValue.toUpperCase() !== 'deactivated'.toUpperCase() && !pr.hideEdit ) && (
                                <Button type="button" color="link" style={{textDecoration: 'none'}} className="text-link small-link pad-0 no-underline" onClick={pr.onEdit}> 
                                    &nbsp;
                                    <FaPencilAlt /> 
                                    &nbsp;
                                    { editName || 'Edit'} 
                                </Button>
                            ) }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="margin-bottom-md">
                        {
                            <div>
                                {data.map((listData, indexData)=>(
                                    <div key={indexData}>
                                        {listData.title && (
                                            <div className="margin-bottom-sm"><strong >{ listData.title}</strong></div>
                                        )}
                                        {
                                            !listData.type ? (
                                                <ul className="list-group margin-bottom-sm">
                                                    {listData.items.map((itemList, indexList)=>(
                                                        <li key={indexList} className="list-group-item clearfix">
                                                            <Row>
                                                                <Col md="4"> {itemList.display || Helpers.titleCase(itemList.name)}: </Col>
                                                                <Col className="text-left text-lg-right text-md-right">
                                                                    <span className="text-bold">
                                                                        {
                                                                            typeof itemList.content === "function" ? (itemList.content({ COL_FIELD: Helpers.getDescendantProp(original,itemList.name), original: original })) 
                                                                            : Helpers.getDescendantProp(original,itemList.name) || Helpers.handleDisplay('') 
                                                                        }
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                            <div style={{clear:'both'}}></div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) 
                                            :
                                            listData.type === 'images' && (
                                                <Row>
                                                    {
                                                        typeof listData.items === "function" ? 
                                                        ( 
                                                            (listData.items({original:original}).map((itemList, indexList)=>(
                                                                <Col key={indexList} md="4">
                                                                    <ImageRender itemList={itemList} />
                                                                </Col>
                                                            )))
                                                        )
                                                        :
                                                        (listData.items.map((itemList, indexList)=>(
                                                            <Col key={indexList} md="4">
                                                                <ImageRender itemList={itemList} />
                                                            </Col>
                                                        )))
                                                    }
                                                </Row>
                                            )
                                        }
                                        
                                    </div>
                                ))}
                            </div>
                        }
                        
                    </Col>
                </Row>
            </div>
        );
    }
}



export default ListDetails;