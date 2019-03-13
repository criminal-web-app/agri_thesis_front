import moment from 'moment';
import React from 'react'
import { Badge } from 'reactstrap'
import Moment from 'react-moment'

import { toast } from 'react-toastify'
// import qs from '../other_modules/query-string/index.js'
import { NavLink } from 'react-router-dom' 

const typeOf = require('kind-of');

const qs = require('query-string');
function serializeUrl (obj, prefix) {
    
    function start() {
        var str = [], p;
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
              if (v !== '' && typeof v !== 'undefined')
                str.push(( v !== null && typeof v === "object") ?
                  serializeUrl(v, k) :
                  encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
    }
    
    const start_value = start();
    return '&' + start_value;

}

function titleCase (input) {
    if (input == null) return '';
    else
        return input.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function getDescendantProp (obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}
    
export const gDp = function(obj, path, def) {
    let val = getDescendantProp (obj, path)
    let typeval = typeOf(val)
    let typeCondVal =   (typeval === 'boolean' && val === false) ? false 
                        : (typeval === 'number' && val === 0) ? 0 
                        : def
    return val || def || typeCondVal
}

function handleStatus (status, { className }={}) {
    // const input = (status || '').toUpperCase();
    var input = ( (status || '').toUpperCase()==='ACTIVE') ? 'Active' : 'Inactive'
    var class_status = ( (status || '').toUpperCase()==='ACTIVE') ? 'success' : 'danger'

    // var class_status = 
    //     (input === 'PENDING') ? 'secondary' : 
    //     (input === 'ACCEPTED' || input === 'ACTIVE') ? 'primary' : 
    //     (input === 'PACKED') ? 'info' : 
    //     (input === 'SENT' || input === 'DELIVERED') ? 'success' : 
    //     (input === 'REJECTED' || input === 'DEACTIVATED') ? 'danger' : 'secondary'

    return (<Badge color={class_status} pill className={`custom ${className}`}>{input}</Badge>)
}


function currency(input, {returnZero=false, minimumFractionDigits=2, maximumFractionDigits=2, symbol= '₱', noSymbol=false}={}) {
    return (input || returnZero) ? ((noSymbol ? '' : symbol) + '' + parseFloat(input || '0').toLocaleString({},{ minimumFractionDigits: minimumFractionDigits, maximumFractionDigits:maximumFractionDigits})) 
                : handleDisplay('')
}

function decimal(input, {returnZero=false, minimumFractionDigits=2, maximumFractionDigits=2}={}) {
    return currency(input, {returnZero, minimumFractionDigits, maximumFractionDigits, noSymbol: true})
}

function handleDisplay(input, str_msg='--' ,pre, sup) {
    return (input || input === 0) ? (pre?pre : '') + input + (sup?sup:''): (<span className='text-uppercase text-italic low-opacity'>{str_msg}</span>)
}

function handleLink(input, {to='', str_msg, pre, sup}) {
    return (
        <div>
            {
                input ? (
                    <NavLink className="pad-0" to={to}>{input}</NavLink>
                ) : 
                handleDisplay(input, str_msg,pre, sup)
            }
        </div>
    )
}

function handleDate(input, format, emptyString=false) {
    return (input && input !== '0000-00-00') ? (<span>{moment(input).format(format)}</span>) :
     (emptyString) ? '' :
     handleDisplay('')
}

const handleScroll = (index) => (event) => {
    let headers = document.getElementsByClassName("rt-thead");
    if (typeof index === 'undefined' || index===null) 
        for (let i = 0; i < headers.length; i++) {
            headers[i].scrollLeft = event.target.scrollLeft;
        }
    else {
        headers[index].scrollLeft = event.target.scrollLeft;
    }
}

function reactTbodyGroup(index) {
    return {
        TbodyComponent:(props) => {
            for (let i = 0; i < props.children[0].length; i++) {
                props.children[0][i] = React.cloneElement(props.children[0][i], { minWidth: props.style.minWidth })
            }
            return <div className="rt-tbody" onScroll={handleScroll(index)}>{props.children}</div>
        },
        TrGroupComponent:(props) => {
            return <div className="rt-tr-group" role="rowgroup" style={{ minWidth: props.minWidth }}>{props.children}</div>
        }
    }
}

function handlePage(that,pageState) {
    (document.getElementsByClassName('rt-tbody')[0]||{}).scrollTop = 0
    for (let p in pageState) 
        pageState[p] =  (typeOf(pageState[p]) === 'string' && pageState[p] ==='' ) ? undefined : pageState[p]
                        
    pageState.page = pageState.page + 1
    pageState.sort_desc = !!pageState.sort_desc || undefined
    that.state.goBack&&that.handleGoBackCount()
    
    let queryParams = !isEmpty(pageState) ? 
                        ('?'+qs.stringify(pageState, {sort: false})) : ''
    that.props.history.push(that.props.history.location.pathname + queryParams);
}

function reactTableDefault({that , st, className='', searchLoading, usePageLimit}) { 
    return {
        manual:true,
        loading: typeof searchLoading === 'boolean' ? searchLoading : st.searchLoading,
        data:st.data,
        pages:st.totalPage,
        minRows: 0,
        noDataText:st.noDataText,
        columns:st.columns,
        ...(usePageLimit ? {pageSize: st.pageState.limit||5}: {}),
        defaultSorted: (st.pageState.sort_id) ? [{ 
            id: st.pageState.sort_id, 
            desc: (typeof st.pageState.sort_desc !== 'undefined' && (st.pageState.sort_desc || '').toString() === 'true')  
        }] : [],
        page: parseInt(st.pageState.page),
        onPageChange:(page)=>{
            that.setState({ toggleCheckBoxAll: false },()=>{
                handlePage(that, {page: page, limit: st.pageState.limit, search: st.pageState.search || undefined, status: st.searchAddDrp.selected || undefined
                    ,sort_id: st.pageState.sort_id || undefined, sort_desc: !!st.pageState.sort_desc || undefined,
                    ...st.pageState.filter
                })
            })
        },
        onPageSizeChange:(limit)=>{
            handlePage(that, {page: 0,limit: limit, search: st.pageState.search || undefined, status: st.searchAddDrp.selected || undefined
                ,sort_id: st.pageState.sort_id || undefined, sort_desc: !!st.pageState.sort_desc || undefined,
                ...st.pageState.filter
            })
        },
        onSortedChange:(sorted)=>{
            handlePage(that, {page: st.pageState.page, limit: st.pageState.limit, search: st.pageState.search || undefined, status: st.searchAddDrp.selected || undefined
                ,sort_id: (sorted[0]||{}).id || undefined, sort_desc: !!(sorted[0]||{}).desc || undefined,
                ...st.pageState.filter
            })
            // handlePage({sorted: sorted})
        },
        defaultPageSize: parseInt(st.pageState.limit) || 10,
        showPaginationBottom: (st.hidePagination) ? false : true,
        className:`-striped -highlight custom-react ${className}`,
        pageSizeOptions: [5, 10, 20, 25, 50, 100, 200, 300, 400, 500, 1000],
        // ...(reactTbodyGroup(index) || {})
    }
}

function callBackMessageToastPop() {
    const callBackMessage = (lS.get('callBackMessage') || {}).message
    if ( callBackMessage ) {
        TOAST.pop({message: callBackMessage})
        lS.remove('callBackMessage')
    }
}

function reduceFieldsToInput(state_field_object={}) {
    let newInputs = {}
    for (let state_input in state_field_object) {
        let state_field = state_field_object[state_input]
        newInputs[state_input] = state_field.reduce((inputs, step) => {
            return {
                ...inputs,
                [step.title]: step.inputs.filter((item)=>Object.keys(item).length > 0)
            }
        }, {})
    }
    return newInputs
}

function getDataIterate (field_name) {
    return function (obj, stack) {
        var newObj = obj
        var returnValue
        for (var property in newObj) {
            if (newObj.hasOwnProperty(property)) {
                // console.log(property === field_name)
                if (property === field_name) {
                    returnValue = newObj[property]
                }
                else if (typeof newObj[property] === "object") {
                    getDataIterate(field_name)(newObj[property], stack + '.' + property);
                } else {/* console.log(property + "   " + newObj[property]);*/}
            }
        }
        return returnValue
    }
}

function setDataIterate(field_name, field_value) {
    return function(obj, stack) {
        let newObj = obj
        for (var property in newObj) {
            if (newObj.hasOwnProperty(property)) {
                newObj[property] = property === field_name ? field_value : newObj[property]
                if (typeof newObj[property] === "object") {
                    setDataIterate(field_name, field_value)(newObj[property], stack + '.' + property);
                } else {/* console.log(property + "   " + newObj[property]);*/}
            }
        }
        return newObj
    }
} 
function integerOnly(e) {
    e.target.value= (parseInt(e.target.value)||0) || ''
}

export const Helpers = {
    titleCase: titleCase,
    getDescendantProp: getDescendantProp,
    currency: currency,
    decimal: decimal,
    handleDisplay: handleDisplay,
    handleDate: handleDate,
    reactTableDefault: reactTableDefault,
    reactTbodyGroup: reactTbodyGroup,
    isEmpty: isEmpty,
    handlePage: handlePage,
    handleLink: handleLink,
    callBackMessageToastPop: callBackMessageToastPop,
    reduceFieldsToInput: reduceFieldsToInput,
    getDataIterate: getDataIterate,
    setDataIterate: setDataIterate,
    integerOnly: integerOnly,
    objectToArray: objectToArray,
}

function getLocalStorage(key, exact) {
    const val = (exact) 
        ? JSON.parse(localStorage.getItem(key)) 
        : (JSON.parse(localStorage.getItem(key) || '{}') || {})
    return val
}

function setLocalStorage(key, value, exact) {
    const val = (exact) ? value : JSON.stringify(value)
    localStorage.setItem(key, val);
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

export const lS = {
    get: getLocalStorage,
    set: setLocalStorage,
    remove: removeLocalStorage
}
export const REG_EX_EMAIL = "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
export const REG_EX_NO_SPCL_ORIG = "^[-0-9a-zA-Z\b]+$" // "^[A-Za-z0-9]+$"
export const REG_EX_NO_SPCLCHAR = "^[-0-9a-zA-ZñÑ \b]+$" // "^[A-Za-z0-9]+$"
export const REG_EX_NO_SPCLCHAR_ADD = "^[-0-9a-zA-ZñÑ()-.,' \b]+$" // "^[A-Za-z0-9]+$"
export const REG_EX_NO_SPCLCHAR_SPACE = "^[-0-9a-zA-ZñÑ\b]+$" // "^[A-Za-z0-9]+$"
export const REG_EX_NO_SC = "/^[^\ ]+$/"
export const REG_EX_NO_SPACE = "/^[^\ ]+$/"
export const REG_EX_FLOATS = "^[0-9]*\.?[0-9]+$"
export const REG_EX_NUM = '^[0-9]*$'
export const REG_EX_CHAR = '^[a-zA-Z]+$'
export const REG_EX_NO_NUM = "^[a-zA-Z \b]+$" // "^[A-Za-z0-9]+$"
export const REG_EX_NO_NUM_SPACE = "^[a-zA-Z\b]+$" // "^[A-Za-z0-9]+$"
export const REG_EX_REAL_NUM = "^-?[0-9]\d*(\.\d+)?$"
 
export const MIN_CHAR = 2
export const MAX_CHAR = 128
export const MIN_VAL = 0

export const MESSAGE_NO_SPCLCHAR = "must be composed only with letters and numbers"
export const MESSAGE_NO_SPCLCHAR_ADD = "must be composed only with letters, numbers and other valid special characters (ex. ñÑ(),.'-)"
export const MESSAGE_NO_SPACE = 'must have no white spaces'
export const MESSAGE_NO_SPCLCHAR_SPACE = "must be composed only with letters and numbers without spaces"
export const MESSAGE_FLOATS = "must be composed only with positive numbers or valid floats"
export const MESSAGE_EMAIL = "must be valid"
export const MESSAGE_NUM = "must be composed only with positive numbers"
export const MESSAGE_MIN_CHAR = `must be between ${MIN_CHAR} and ${MAX_CHAR} characters`
export const MESSAGE_POS_NUM = 'must only be positive numbers'
export const MESSAGE_CHAR_ONLY = 'must only be characters'
export const MESSAGE_NO_NUM = "must be composed only with characters with spaces"
export const MESSAGE_NO_NUM_SPACE = "must be composed only with characters without spaces"
export const MESSAGE_REAL_NUM = "must be composed only with numbers"


export const DATE_FORMAT    = 'MM/DD/YY'
export const TIME_FORMAT    = 'hh:mm a'
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`

export const DATE = {
    DATE_DASH: 'YYYY-MM-DD',
    DATE_FORMAT,
    TIME_FORMAT,
    DATETIME_FORMAT
}

export const TOAST = {
    toastState: toastState,
    pop: toastPop
}

function objectToArray(obj={}, undefined_cond) {
    const new_obj = obj
    const new_array = Object.entries(new_obj).filter((item=[])=>{
        return !(undefined_cond && (item[1] === '' ||  typeof item[1] === 'undefined'))
    }) || []
    return new_array
}

function toastState (message, type = 'success') {
    return {
        type: type,
        message: message,
        show: true
    }
}

function toastPop({message, context, type = 'success', autoClose= 3000, toastId=''}) {
    const Msg =  () => (
        <div>
            <h6>{message}</h6>
            <div>{context}</div>
        </div>
    )
    toast( (context ? <Msg /> : message), {type, autoClose, toastId})
}