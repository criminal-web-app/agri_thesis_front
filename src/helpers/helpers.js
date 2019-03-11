import moment from 'moment';
import React from 'react'
import { Badge } from 'reactstrap'
import Moment from 'react-moment'

import { toast } from 'react-toastify'
import Mark from 'mark.js'
// import qs from '../other_modules/query-string/index.js'
import { NavLink } from 'react-router-dom' 

import * as API from '../services/API'
import clipboard from "clipboard-polyfill/build/clipboard-polyfill.promise"
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

function equalObject(a,b) {
    for(let i in a) {
        if(typeof b[i] === 'undefined') {
            return false;
        }
        if(typeof b[i] === 'object') {
            if(!b[i].equals(a[i])) {
                return false;
            }
        }
        if(b[i] !== a[i]) {
            return false;
        }
    }
    for(let i in b) {
        if(typeof a[i] === 'undefined') {
            return false;
        }
        if(typeof a[i] === 'object') {
            if(!a[i].equals(b[i])) {
                return false;
            }
        }
        if(a[i] !== b[i]) {
            return false;
        }
    }
    return true;
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

function handleBookingTransactionStatus(input) {
    var class_status = 
        ( ['PENDING'].includes(Helpers.similar(input)) ) ? 'secondary' : 
        ( ['DISPATCHED','ACTIVE'].includes(Helpers.similar(input)) ) ? 'primary' : 
        ( ['SENT','POD'].includes(Helpers.similar(input)) ) ? 'success' : 
        ( ['CANCELLED','RTS'].includes(Helpers.similar(input)) ) ? 'danger' : 'secondary'
    return (<Badge color={class_status} pill>{((input || '').toUpperCase())}</Badge>)
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

function handleDateValue(input, format) {
    return (input && input !== '0000-00-00') ? moment(input).format(format) : ''
}

function handleBoolean(input, trueString, falseString) {
    return input ? (<span>{trueString}</span>) : (<span>{falseString}</span>)
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

function mark({ containerClass = 'searchtext', inputName = 'query'}) {
    var markInstance = new Mark(document.querySelector("." + containerClass));
    // Cache DOM elements
    var keywordInput = document.querySelector("input[name='"+ inputName+"']");
    var optionInputs = document.querySelectorAll("input[name='opt[]']");

    function performMark() {
        // Read the keyword
        var keyword = keywordInput.value;

        // Determine selected options
        var options = {};
        [].forEach.call(optionInputs, function(opt) {
            options[opt.value] = opt.checked;
        });

        // Remove previous marked elements and mark
        // the new keyword inside the context
        setTimeout(function() {
            markInstance.unmark({
                done: function(){
                    markInstance.mark(keyword, options);
                }
            });
        }, 200)
        
    };

    // Listen to input and option changes
    keywordInput.addEventListener("input", performMark);
    for (var i = 0; i < optionInputs.length; i++) {
        optionInputs[i].addEventListener("change", performMark);
    }
}

function generateCSVArray(st, datas) {
    let csv_data = datas.map(( dData, dIndex)=>{
        let colmns = st.columns
        let return_data = []
        let manualIndex =0;
        for (let c in colmns) {
            let field_name=colmns[c].accessor || '';
            if (field_name.indexOf('_') === -1) {
                return_data[manualIndex] = getDescendantProp(dData, field_name)
                manualIndex++;
            }
        }
        return return_data
    })

    let headers = (st.columns.reduce((acc,cData)=>{
        let field_name= (cData.accessor || '').replace(/\./g,' ') || ''
        
        if (field_name.indexOf('_') === -1) return [...acc, field_name]
        return [...acc]
    }, []) )

    return [ headers, ...csv_data]
}

function callBackMessageToastPop() {
    const callBackMessage = (lS.get('callBackMessage') || {}).message
    if ( callBackMessage ) {
        TOAST.pop({message: callBackMessage})
        lS.remove('callBackMessage')
    }
}

function validatePackagingInput(row={}, configValid, defaultRow={}) {
    let newRow = row
    newRow.error = {}
    for (let name in configValid) {
        newRow[name] = newRow[name] || defaultRow[name] || ''
        let config = configValid[name]
        let {isRequired} = config
        if (isRequired) {
            if ( 
                // (!newRow.package_size || newRow.package_size === 'customized') && 
                (newRow[name] === '' || typeof newRow[name] === 'undefined' || newRow[name] === null))
                newRow.error[name] = { ...newRow.error[name], message: 'Required'}
            else {
                delete newRow.error[name]
            }
        }
    }
    return newRow
}

function parsePackagingValidation(data, fieldValidate={}) {
    return data.reduce((acc, item)=> {
        let newFieldValidate = {}
        if ( (item.payment_type || 'COD' ) === 'COD') 
            newFieldValidate = { ...fieldValidate, cod_amount: { isRequired: true} }
        else if (item.payment_type === 'MPOS') 
            newFieldValidate = { ...fieldValidate, mpos_amount: { isRequired: true}}
        else
            newFieldValidate = { ...fieldValidate, cod_amount: {} } 

        let newItem = Object.keys(newFieldValidate).length > 0 ? validatePackagingInput(item, newFieldValidate) : item
        let itemErrors = Object.keys(newItem.error || {}).length
        let notexistadd = item.exist === false ? 1:0
        return (itemErrors > 0  ? { error: (acc.error+itemErrors), data: [...acc.data, newItem], validData: acc.data, notexist: (acc.notexist+notexistadd) } 
                                : { error: acc.error, data: [...acc.data, newItem], validData: [...acc.data, newItem], notexist: (acc.notexist+notexistadd) })
    }, { error:0, notexist:0, data:[], validData: [] }) || {}
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

function onCopy (label, value) {
    return function (e) {
        e = e || window.event;
        var key = e.which || e.keyCode; // keyCode detection
        var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false); // ctrl detection
        if ( ( (key === 67) && ctrl || e.type === 'click' ) && value ) {
            clipboard.writeText(value);
            TOAST.pop({message: `${label}: ${value || ''} copied!`, type:'info'})
        }  
    }
}

function objectToArray(obj={}, undefined_cond) {
    const new_obj = obj
    const new_array = Object.entries(new_obj).filter((item=[])=>{
        return !(undefined_cond && (item[1] === '' ||  typeof item[1] === 'undefined'))
    }) || []
    return new_array
}


function processFilterUrl ({that={}, st={}}) {
    return function ({filter={}}) {
        that.setState({
            pageState: {...st.pageState, filter}
        },()=>{
            Helpers.handlePage(that, {page: 0, limit: st.pageState.limit, search: st.query, status: st.searchAddDrp.selected, sort_id: st.pageState.sort_id, sort_desc: !!st.pageState.sort_desc,
                ...filter})
        })
    }
}

function plural(input='') {
    const vowel = ['a','e','i','o','u']
	if (input.slice(-1) === 'y') {
		if ( vowel.includes(input.charAt(input.length - 2)) ) {
			// If the y has a vowel before it (i.e. toys), then you just add the s. 
			return input + 's';
		}
		else {
			// If a input ends in y with a consonant before it (fly), you drop the y and add -ies to make it plural. 
			return input.slice(0, -1) + 'ies';
		}
	}
	else if (input.substring( input.length - 2) === 'us') {				
		// ends in us -> i, needs to preceed the generic 's' rule
		return input.slice(0, -2) + 'i'; 
	}
	else if (['ch', 'sh'].indexOf(input.substring( input.length - 2)) !== -1 || ['x','s'].indexOf(input.slice(-1)) !== -1) {
	 	// If a input ends in ch, sh, x, s, you add -es to make it plural.
		return input + 'es';
	}
	else {
		// anything else, just add s			
		return input + 's';
	}
}

function inputAsync(that,{limit=9999999 ,field='',name='',label='',isUnique=false, customOptionComponents=()=>{}, selectedValue='', routeName='', returnField='',returnDisplay='', field_data_name='', handleInputChange='', add_params={}, default_search='', field_id='', isNeededID=false, }) {
    const st = that.state
    let handleInputFunc = ()=>{}
    if (typeof handleInputChange === "function") {
        handleInputFunc = handleInputChange
    } else {
        handleInputFunc = ({input, title}) => (selectedOption={})=>{ 
            that.setState({
                pageState: { ...st.pageState, filter: { ...st.pageState.filter, [field]: selectedOption[returnField] } }
            })
        }
    }

    const new_default_search = default_search || ''

    return {
        input: [ 
            {
                name,label,selectedValue,customOptionComponents, isUnique,
                className: 'white-background',
                type: "select-dropdown",
                async: true,                     
                handleInputChange: handleInputFunc,
                loadOptions: (timeout) => (inputValue='', callback)=>{
                    const st = that.state
                    if (st.typingTimeout) 
                        clearTimeout(st.typingTimeout)
                    that.setState({
                        async_field: {...(st.async_field||{}), [field]: inputValue},
                        typingTimeout: setTimeout(()=>{
                            const params = { page: 1, limit, 
                                search: (inputValue.length <= new_default_search.length ? new_default_search : inputValue)||  gDp(st, 'async_field',{})[field],
                                status: 'active', ...add_params
                            }
                            
                            API[routeName]({params})
                                .then(response => {
                                    const {data=[]} = response || {}
                                    console.log(selectedValue)
                                    const field_data_check = isNeededID ? data.filter((site)=> site.code===selectedValue): ''
                                    const field_idNeeded = field_data_check.length ? field_data_check[0].id : '' 
                                    console.log(field_data_check)   
                                    console.log(isNeededID, field_id)
                                    isNeededID && that.setState({ [field_id] : field_idNeeded })
                                    let data_process = data.map(item=>({...item, label: item[returnDisplay || returnField], value: item[returnDisplay || returnField]}))
                                    if (isUnique) 
                                        data_process = removeDuplicates(data_process)
                                    that.setState({
                                        ...(field_data_name ? { [field_data_name]: data_process }: {})
                                    },()=>{
                                        if (beginsWith(inputValue,new_default_search, true) || typeof default_search === 'undefined') {
                                            callback(data_process)
                                        } else 
                                            callback([])
                                    })
                                }, err=> {
                                    that.setState({[field_data_name]:[]});
                                }).finally(()=>{
                                    // that.setState({ searchLoading: false })
                                })
                           
                        }, 500)
                    }) 
                }
            }
        ]
    }
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

function jsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
}

function parseBool(b) {
    return !(/^(false|0)$/i).test(b) && !!b;
}

function controlMaxLength(e, inputMaxLength=7){
    e.target.value = Math.max(0, parseFloat(e.target.value) ).toString().slice(0,inputMaxLength)
}

function integerOnly(e) {
    e.target.value= (parseInt(e.target.value)||0) || ''
}

function getDropdowns(data, bool, { limit=9999999, search='' , loadOptionsCallBack=()=>{} }={}) {
    return function(that) {
        const params = (!data.id)
        ? {
            page: 1,
            limit: limit,
            search:search || '',
            status: 'active',
            ...(data||{}).params
        } : {
            id: data.id,
            page: 1,
            limit: limit,
            status: 'active',
            ...(data||{}).params
        }

        return API[data.method]({params})
            .then(response => {
                if (data.field_data_name)
                    that.setState({[data.field_data_name]: response.data })

                for (let dp in data.populate) {
                    const state_fields =    that.state[data.populate[dp].state]
                    const new_data = response.data.map((item, index) => {
                        return {
                            ...(data.fields || []).reduce((acc,field)=>({ ...acc,[field.varField]: item[field.valField] }), {}),
                            label: item[data.returnField || 'name'],
                            value: data.returnLabel ? item[data.returnField || 'name'] : item.id,
                            id: item.id
                        }
                    })

                    const new_inputs = state_fields[0].inputs.map((item, index) => {
                        if (item.name === data.populate[dp].identifier) {
                            const new_item = {
                                ...item,
                                options:new_data,
                                selectedValue: (bool) ? '' : item.selectedValue // test
                            }
                            return new_item
                        } else 
                        return item
                    })
                    that.setState({
                        [data.populate[dp].state]: [
                            {
                                ...state_fields[0],
                                inputs:new_inputs
                            }
                        ]
                    },()=>{
                        loadOptionsCallBack(new_data)
                    })
                } 

                if ( typeof data.responseSuccess === "function" ) 
                    data.responseSuccess(response)

            }, err=> { 
                if (data.method !== 'getBookingReasons') {
                    const { message } = err
                    const msg = message+'. ' || ''
                    if (msg!==  that.toastId) {
                        TOAST.pop({message: msg, type:'error', toastId: msg})
                    }
                    that.setState({isLoading:false})
                }
            })
        }
}

function removeDuplicates(myArr, prop='value', last_index) {
    return myArr.filter((obj, pos, arr) => {
        const mapArray = arr.map(mapObj => mapObj[prop])
        if (!last_index)
            return mapArray.indexOf(obj[prop]) === pos
        else 
            return mapArray.lastIndexOf(obj[prop]) === pos
    })
}

function contains(searchFor, str, vice_versa){
    const new_searchFor = (searchFor || '').replace(/\\/g,'')
    const new_str = (str || '').replace(/\\/g,'')
    var pattern = new RegExp(new_searchFor, 'gi')
    var revPattern = new RegExp(new_str, 'gi')
    return pattern.test(new_str) || (vice_versa && revPattern.test(new_searchFor))
}

function beginsWith(searchFor, str, vice_versa){
    const new_searchFor = (searchFor || '').replace(/\\/g,'')
    const new_str = (str || '').replace(/\\/g,'')
    var pattern = new RegExp("\^" + new_searchFor, 'gi')
    var revPattern = new RegExp("\^" + new_str, 'gi')
    return pattern.test(new_str) || (vice_versa && revPattern.test(new_searchFor))
}

function endsWith(searchFor, str, vice_versa){
    const new_searchFor = (searchFor || '').replace(/\\/g,'')
    const new_str = (str || '').replace(/\\/g,'')
    var pattern = new RegExp(new_searchFor + "\$", 'gi')
    var revPattern = new RegExp(new_str + "\$", 'gi')
    return pattern.test(new_str) || (vice_versa && revPattern.test(new_searchFor))
}

function similar(input=''){
    const newInput = typeof input !== 'string' ? '': input
    return newInput.toUpperCase().trim().replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
}

function sort_packaging_type(items=[]) {

    let item_map = items.map(item=>{
        var sort_id= 
            item.code === 'SPC' ? 1 :
            item.code === 'MPC' ? 2 :
            item.code === 'LPC' ? 3 :
            item.code === 'SBX' ? 4 :
            item.code === 'MBX' ? 5 :
            item.code === 'LBX' ? 6 : 999
        return {
            ...item,
            ...({sort_id})
        }
    }).sort(function(a, b) { 
        return a.sort_id - b.sort_id;
    })

    return item_map
}

export const Helpers = {
    serializeUrl: serializeUrl,
    titleCase: titleCase,
    equalObject: equalObject,
    getDescendantProp: getDescendantProp,
    handleStatus: handleStatus,
    handleBookingTransactionStatus: handleBookingTransactionStatus,
    currency: currency,
    decimal: decimal,
    handleDisplay: handleDisplay,
    handleDate: handleDate,
    handleDateValue: handleDateValue,
    handleBoolean: handleBoolean,
    reactTableDefault: reactTableDefault,
    reactTbodyGroup: reactTbodyGroup,
    mark: mark,
    isEmpty: isEmpty,
    handlePage: handlePage,
    generateCSVArray: generateCSVArray,
    handleLink: handleLink,
    callBackMessageToastPop: callBackMessageToastPop,
    validatePackagingInput: validatePackagingInput,
    parsePackagingValidation: parsePackagingValidation,
    reduceFieldsToInput: reduceFieldsToInput,
    onCopy: onCopy,
    objectToArray: objectToArray,
    processFilterUrl: processFilterUrl,
    plural: plural,
    handlePhoneDisplay: handlePhoneDisplay,
    handlePhoneFormat: handlePhoneFormat,
    inputAsync: inputAsync,
    getDataIterate: getDataIterate,
    setDataIterate: setDataIterate,
    jsonParse: jsonParse,
    parseBool: parseBool,
    controlMaxLength: controlMaxLength,
    integerOnly: integerOnly,
    getDropdowns: getDropdowns,
    removeDuplicates: removeDuplicates,
    contains: contains,
    beginsWith: beginsWith,
    endsWith: endsWith,
    similar: similar,
    sort_packaging_type: sort_packaging_type
}

function handlePhoneDisplay (phone, type) {

    if (type==='mobile') {
        return (phone==='63' || phone==='') 
            ? '' 
            : ('0'+phone.substr(-10))
    } else {
        return (phone.substr(-10))
    }
}

function handlePhoneFormat (phone, type) {
    const trimmed = phone.replace(/[^0-9]/g, "")
    return handlePhoneDisplay(trimmed, type)
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

function range (len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr
}
function generateProd ( arr = ["Lemon", "Honey Lemon", "Tea", "Ginger+Cayenne", "Apple+Cinnamon"]) {
    return arr.map( (value) => {
        return {
            prod_name: value,
            sku: `SK-${random(999, 8000)}`,
            set: range(2).map((v, idx) => (
                {
                    size: idx%2 ? "16oz" : "22oz",
                    qty: random(20),
                    price: idx%2 ? 20 : 25,
                }
            ))
        }
    })
}
function newDailyReport (idx) {
    const report = {
        dateCreated: moment().subtract(idx, 'days').format("MM/DD/YYYY"),
        target: random(999, 4000),
        products: generateProd(),
        index: idx + 1
    }
    report.totals = report.products.reduce((mainTotal, currentProd) => {
        return mainTotal + currentProd.set.reduce((subTotal, currentSet) => {
            return subTotal + (currentSet.price * currentSet.qty)
        }, 0)
    }, 0)
    return report
}

function generateMaterials () {
    return [
        {
            name: "Lemon",
            price: 20
        },
        {
            name: "Honey",
            price: 1500
        },
        {
            name: "Sugar",
            price: 20
        },
        {
            name: "Yakult",
            price: 10
        }
    ]
}

function generateFranchise () {
    return [
        {
            name: "A&A",
            address: "573 North Circle Ave. Muscatine, IA 52761"
        },
        {
            name: "Meals",
            address: "11 Cobblestone Lane North Haven, CT 06473"
        },
        {
            name: "Foodure",
            address: "4 Bellevue Court Bethel Park, PA 15102"
        },
        {
            name: "Dronuts",
            address: "474 Gartner Ave. Brainerd, MN 56401"
        }
    ]
}

function makeFranchiseData (len = 5) {
    return generateFranchise().map((value, idx) => {
        return {
            company_name: value.name,
            address: value.address,
            dateFrom: moment().subtract(6, 'days').format("MMM, DD YYYY"),
            dateTo: moment().format("MMM, DD YYYY"),
            reports: makeData()
        }
    })
}

function makeFranchiseSOA (len = 5) {
    return generateMaterials().reduce((acc, mat) => {
        return [
            ...acc,
            ...generateFranchise().map((franchise, idx)=> {
                return  {
                    company_name: franchise.name,
                    address: franchise.address,
                    delivery_date: moment().subtract(random(2),'months').subtract(random(4), 'days').format("MMM, DD YYYY"),
                    material: mat.name,
                    supplied_qty: random(20, 0),
                    price_each: mat.price
                }
            }) 
        ]
    }, [])
}

 export const GenerateRandomString = (length) => {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    
    return text
} 

function random (num, base = 1) {
    return Math.floor(Math.random() * num) + base
}

function makeData(len = 7) {
    return range(len).map((value, idx) => {
        return newDailyReport(idx)
    });
}

function createSpace(length) {
    return range(length).reduce((acc,i)=>{return [...acc, ...[""]]},[])
}

export const Reports = {
    // parseSales: parseSales,
    // getMaterials: generateMaterials,
    // getFranchise: generateFranchise,
    // franchise: makeFranchiseData,
    // franchiseSOA: makeFranchiseSOA,
    // report: makeData,
    // parseSalesAsCSV: makeSalesCSV,
    // parseSOAAsCSV: makeSOACSV
}

export const HOURS = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
export const MINUTES = [
    '00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19',
    '20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39',
    '40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59', 
]
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

export const CONTACT_NUMBER = '+63 999-563-1279'
export const FACEBOOK_PAGE = 'https://www.facebook.com/codedisruptors'
export const MAIN_WEBSITE = 'http://codedisruptors.com/#!/main'
export const STAGING_APP = 'http://sme-staging.codedisruptors.com.s3-website-ap-southeast-1.amazonaws.com/login'

export const DEFAULT_STATUS = 'Active'

export const CONTENT_DATE = {
    content: ({COL_FIELD})=>{
        return ( <span> { COL_FIELD !== '0000-00-00' && COL_FIELD ? (<span>{moment(COL_FIELD).format(DATE_FORMAT)}</span>) : Helpers.handleDisplay('','--')} </span>  )
    } 
}

export const CONTENT_PRICE = {
    content: ({COL_FIELD})=>{
        return ( <span> { COL_FIELD ? Helpers.currency(COL_FIELD) : Helpers.handleDisplay('','0') } </span>  )
    } 
}

export const CONTENT_TITLECASE = {
    content: ({COL_FIELD})=>{
        return ( <span> { COL_FIELD ? Helpers.titleCase(COL_FIELD) : Helpers.handleDisplay('','--') } </span>  )
    } 
}

export const CONTENT_LINK = ({to = '', fields=[]}) => {
    return {
        content: ({COL_FIELD, original})=>{
            let toFormat = to
            for (let f in fields) 
                toFormat = toFormat.replace((':' + fields[f]), getDescendantProp(original, fields[f])) || ''
            return handleLink(COL_FIELD, {to: toFormat})
        } 
    }
}


export const DefaultInputState = {
    name: "sku",
    label: "Sku*",
    type: "text", 
    isRequired: true,
    validators: {
        required: {value: true, errorMessage: "Please enter sku code"},
        pattern: {value: '', errorMessage: `Your code ${MESSAGE_NO_SPCLCHAR}`},
        minLength: {value: MIN_CHAR, errorMessage: `Your sku code ${MESSAGE_MIN_CHAR}`},
        maxLength: {value: MAX_CHAR, errorMessage: `Your sku code ${MESSAGE_MIN_CHAR}`}
    }
}

export const DefaultState = {
    titleHeader: '',
    data: [],
    csvRawData: [],
    checkData: [],
    // totalItems: 0,
    itemData: {},
    confirmItemData: {},
    // stateReactTable: {},
    modalMode: "CREATE",
    searchLoading: false,
    pages: null,
    isItemModalOpen: false,
    isConfirmModalOpen: false,
    confirmModalDetails: {
        title: '',
        status: '',
        data: []
    },
    query: "",
    itemModalTitle: "",
    noDataText: 'No data available.',
    selected: {},
    status:"Activate",
    toastrVisible:false,
    toastrMessage:'',
    toastrType:'success',
    toastrPosition:'TOP_RIGHT',
    toastrCloseTime:6000,
    toast: {
        show:false,
        message:'',
        type:'success',
        position:'TOP_RIGHT',
        closeTime:6000,
    },
    columns: [],
    fields: [],
    listDetails: {
        title: '',
        subTitle: '',
        haveBorder: null, 
        showStatus: null,
        statusName: '',
        data: []
    },
    tableFormDetails: {
        title: '',
        subTitle: '',
        haveBorder: null, 
        showStatus: null,
        statusName: '',
        columns: [],
        data: [],
        items: {},
        loadingData: false
    },
    searchAddDrp: {
        type: "dropdown",
        title: "",
        selected: '',
        values: [
            {
                value: "",
                label: "All"
            }
        ]
    }, 
    searchAddBtn: {
        type: "button",
        color: "primary",
        title: "+ Create new"
    },
    submitted: false
    
}

export const TOAST = {
    toastState: toastState,
    pop: toastPop
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

function filterField(target) {
    if (target) {
        target.addEventListener("keydown", function(e) {
            if ([69, 187, 189, 109].includes(e.keyCode)) {
                e.preventDefault()
            }
        })
        target.addEventListener("keyup", function(e) {
            if (e.target.value.length > 10)
            e.target.value = e.target.value.slice(0, 10) 
        })
    }
}

export const Field = {
    filterField: filterField
} 

export const STATUS = [
    {
        label: 'Active',
        value: 'Active'
    },
    {
        label: 'Inactive',
        value: 'Inactive'
    }
]

export const VALUES = {
    requiredPackagingItem: {
        length: { isRequired: true },
        width: { isRequired: true },
        height: { isRequired: true },
        weight: { isRequired: true },
        package_quantity: { isRequired: true }
    }
}

export const TRANSACTION_STATUS = [
    {
        label: 'Scan In Package',
        value: 'SIP'
    },
    {
        label: 'Scan In Package Linehaul',
        value: 'SIPL'
    },
    {
        label: 'Scan Out Package Linehaul',
        value: 'SOPL'
    },
    {
        label: 'Scan Out Package Delivery',
        value: 'SOPD'
    },
    {
        label: 'Proof of Delivery',
        value: 'POD'
    }
]

export const CREDIT_TERMS = [
    {
        label: 'Select...',
        value: ''
    },
    {
        label: '7 Days',
        value: '7 Days'
    },
    {
        label: '15 Days',
        value: '15 Days'
    },
    {
        label: '30 Days',
        value: '30 Days'
    },
    {
        label: 'Cash on Delivery',
        value: 'Cash on Delivery'
    },
]

export const PAYMENT_TERMS =[
    {
        label:'Cash on delivery', 
        value:'COD'
    },
    {
        label:'Freight Charge', 
        value:'Freight Charge'
    },
    {
        label:'Valuation', 
        value:'Valuation'
    },
    {
        label:'Value added services', 
        value:'VAS'
    },
    {
        label:'Promo', 
        value:'Promo'
    }
]

export const OPTIONS = {
    filter_status: [
        {
            value: "active",
            label: "Active"
        },
        {
            value: "inactive",
            label: "Inactive"
        },
        {
            value: "all",
            label: "All"
        },
    ],
    booking_status: [
        {
            value: "pending",
            label: "Pending"
        },
        {
            value: "dispatched",
            label: "Dispatched"
        },
        {
            value: "PUP",
            label: "PUP"
        },
        {
            value: "PUX",
            label: "PUX"
        },
        {
            value: "cancelled",
            label: "Cancelled"
        },
        {
            value: "all",
            label: "All"
        }
    ],
    transaction_status: [
        {
            value: "PUP",
            label: "PUP"
        },
        {
            value: "PUX",
            label: "PUX"
        },
        {
            value: "SIP",
            label: "SIP"
        },
        {
            value: "SOPL",
            label: "SOPL"
        },
        {
            value: "SIPL",
            label: "SIPL"
        },
        {
            value: "ON HOLD",
            label: "ON HOLD"
        },
        {
            value: "SOPD",
            label: "SOPD"
        },
        {
            value: "POD",
            label: "POD"
        },
        {
            value: "PODEX",
            label: "PODEX"
        },
        {
            value: "RTS",
            label: "RTS"
        }
    ],
    msu_status: [
        {
            value: "PUP",
            label: "PUP"
        },
        {
            value: "PUX",
            label: "PUX"
        },
        {
            value: "POD",
            label: "POD"
        },
        {
            value: "PODEX",
            label: "PODEX"
        },
        {
            value: "RTS",
            label: "RTS"
        },
        // {
        //     value: "CLAIMS",
        //     label: "CLAIMS"
        // },
    ],
    item_status: [
        {
            value: "SIP",
            label: "SIP"
        },
        {
            value: "SOPL",
            label: "SOPL"
        },
        {
            value: "SIPL",
            label: "SIPL"
        },
        {
            value: "SOPD",
            label: "SOPD"
        },
        {
            value: "POD",
            label: "POD"
        },
        {
            value: "PODEX",
            label: "PODEX"
        },
        {
            value: "RTS",
            label: "RTS"
        },
        {
            value: "all",
            label: "All"
        },
    ],
    vas_types: [
        {
            label: 'Percentage',
            value: 'percentage'
        },
        {
            label: 'Value',
            value: 'value'
        }
    ],
    route_types: [
        {
            label: 'Linehaul',
            value: 'Linehaul'
        },
        {
            label: 'Delivery',
            value: 'Delivery'
        },
        {
            label: 'Pickup',
            value: 'Pickup'
        }
    ],
    payment_types: [
        { code: 'COD', name: 'COD' },
        { code: `Shipper's Collect`, name: `Shipper's Collect` },
        { code: 'MPOS', name: 'MPOS' },
        { code: 'NON-COD', name: 'NON-COD' },
        // { code: 'Prepaid', name:'Prepaid' },
        // { code: 'Freight Collect', name: 'Freight Collect' }
    ],
    cancelled_transaction_reason: [
        {label: 'Lack of Time', value: 'Lack of Time'},
        {label: 'Customer Not Around', value: 'Customer Not Around'},
        {label: 'Business/Residence Closed', value: 'Business/Residence Closed'},
        {label: 'Customer Requested Specific Date', value: 'Customer Requested Specific Date'},
        {label: 'Unlocated/Bad Address', value: 'Unlocated/Bad Address'},
        {label: 'Road Closed', value: 'Road Closed'},
        {label: 'Road Accident', value: 'Road Accident'},
        {label: 'Double Order', value: 'Double Order'},
        {label: 'Wrong Item', value: 'Wrong Item'},
        {label: 'Change of Mind', value: 'Change of Mind'},
        {label: 'Incomplete Item', value: 'Incomplete Item'},
        {label: 'No Open Policy', value: 'No Open Policy'},
        {label: 'Unable Payment', value: 'Unable Payment'},
        {label: 'Change of Address', value: 'Change of Address'},
        {label: 'Unknown Consignee', value: 'Unknown Consignee'},
        {label: 'Wrong Address', value: 'Wrong Address'},
        {label: 'Unserviceable', value: 'Unserviceable'},
        {label: 'Transaction Cancelled', value: 'Transaction Cancelled'},
        {label: 'Transaction Deleted', value: 'Transaction Deleted'}
    ],
    rts_reason: [
        {label: 'Unlocated/Bad Address', value: 'Unlocated/Bad Address'},
        {label: 'Transferred Residence', value: 'Transferred Residence'},
        {label: 'Damaged Packaging/item', value: 'Damaged Packaging/item'},
        {label: 'Incorrect Item', value: 'Incorrect Item'},
        {label: 'Misrouted', value: 'Misrouted'},
        {label: 'Request Date of Delivery is beyond SLA', value: 'Request Date of Delivery is beyond SLA'},
        {label: 'Customer Rejection/Change of Mind/Cancellation/refused to Accept', value: 'Customer Rejection/Change of Mind/Cancellation/refused to Accept'},
        {label: 'Unknown Cnee', value: 'Unknown Cnee'},
        {label: 'Unable Payment', value: 'Unable Payment'},
    ],
    pux_reason: [
        {label: 'Cancelled by Shipper', value: 'Cancelled by Shipper'},
        {label: 'Cargo (Truck Pick up)', value: 'Cargo (Truck Pick up)'},
        {label: 'Critical Area', value: 'Critical Area'},
        {label: 'Document (Motor Pick up only)', value: 'Document (Motor Pick up only)'},
        {label: 'Double Booking', value: 'Double Booking'},
        {label: 'DX already picked up upon arrival of the courier', value: 'DX already picked up upon arrival of the courier'},
        {label: 'DX/PX not ready', value: 'DX/PX not ready'},
        {label: 'Flooded Area (Impassable due to heavy rains)', value: 'Flooded Area (Impassable due to heavy rains)'},
        {label: 'Gatepass not ready', value: 'Gatepass not ready'},
        {label: 'Incomplete Attachment', value: 'Incomplete Attachment'},
        {label: 'Late Booking (Beyond Cut-Off)', value: 'Late Booking (Beyond Cut-Off)'},
        {label: 'Office/Residence closed upon arrival', value: 'Office/Residence closed upon arrival'},
        {label: 'Payment not ready', value: 'Payment not ready'},
        {label: 'Prohibited Items', value: 'Prohibited Items'},
        {label: 'Shipper not around', value: 'Shipper not around'},
        {label: 'Unknown Shipper', value: 'Unknown Shipper'},
        {label: 'Vehicle Breakdown', value: 'Vehicle Breakdown'},
        {label: 'Wrong Address', value: 'Wrong Address'},
        {label: 'Wrong Cargo details (Discrepancy in weight, dimension and pieces)', value: 'Wrong Cargo details (Discrepancy in weight, dimension and pieces)'},
        {label: 'Wrong Pick up address (Invalid Contact number)', value: 'Wrong Pick up address (Invalid Contact number)'},
    ],
    podex_reason: [
        {label: '3-AT - All issues with 3 attempts to redel', value: '3-AT - All issues with 3 attempts to redel'},
        {label: 'AWR - Acts of War (street disturbance, riots)', value: 'AWR - Acts of War (street disturbance, riots)'},
        {label: 'BAD - Undeliver due to Unlocated/Bad Address', value: 'BAD - Undeliver due to Unlocated/Bad Address'},
        {label: 'BCD - Undelivered due to Business Closed', value: 'BCD - Undelivered due to Business Closed'},
        {label: 'CNA - Undelivered due to Customer Not Around', value: 'CNA - Undelivered due to Customer Not Around'},
        {label: 'CRBC - Undelivered due to Client Rejection - Beyond Cut-off', value: 'CRBC - Undelivered due to Client Rejection - Beyond Cut-off'},
        {label: 'CTF - Consignee Trannsferred Residence', value: 'CTF - Consignee Trannsferred Residence'},
        {label: 'CTV - Courier Traffic Violation', value: 'CTV - Courier Traffic Violation'},
        {label: 'DMD - Undelivered due to Damaged Packaging or Item', value: 'DMD - Undelivered due to Damaged Packaging or Item'},
        {label: 'FMJ - Force Majeure', value: 'FMJ - Force Majeure'},
        {label: 'INC - Undelivered due to Incorrect Item', value: 'INC - Undelivered due to Incorrect Item'},
        {label: 'LI - Lost Item', value: 'LI - Lost Item'},
        {label: 'LT - Lack of Time', value: 'LT - Lack of Time'},
        {label: 'MIS - Misrouted', value: 'MIS - Misrouted'},
        {label: 'PNR - Undelivered due Payment Not Ready', value: 'PNR - Undelivered due Payment Not Ready'},
        {label: 'RAD - Road Accident', value: 'RAD - Road Accident'},
        {label: 'RCD - Undelivered due to Residence Closed', value: 'RCD - Undelivered due to Residence Closed'},
        {label: 'RCL - Road Closed', value: 'RCL - Road Closed'},
        {label: 'RDD - Undelivered due to Customer Requested Specific Date of Redelivery', value: 'RDD - Undelivered due to Customer Requested Specific Date of Redelivery'},
        {label: 'RTA - Undelivered due to Customer Rejection/ Change of Mind/ Cancellation/ Refused to Accept', value: 'RTA - Undelivered due to Customer Rejection/ Change of Mind/ Cancellation/ Refused to Accept'},
        {label: 'UCN - Undelivered due to Unknown Consignee', value: 'UCN - Undelivered due to Unknown Consignee'},
        {label: 'UPC - Undelivered due to Unable Payment for Cancellation', value: 'UPC - Undelivered due to Unable Payment for Cancellation'},
        {label: 'VBR - Vehicle Breakdown', value: 'VBR - Vehicle Breakdown'},
    ],
    rts_reason: [
        {label: 'Unlocated/Bad Address', value: 'Unlocated/Bad Address'},
        {label: 'Transferred Residence', value: 'Transferred Residence'},
        {label: 'Damaged Packaging/item', value: 'Damaged Packaging/item'},
        {label: 'Incorrect Item', value: 'Incorrect Item'},
        {label: 'Misrouted', value: 'Misrouted'},
        {label: 'Request Date of Delivery is beyond SLA', value: 'Request Date of Delivery is beyond SLA'},
        {label: 'Customer Rejection/Change of Mind/Cancellation/refused to Accept', value: 'Customer Rejection/Change of Mind/Cancellation/refused to Accept'},
        {label: 'Unknown Cnee', value: 'Unknown Cnee'},
        {label: 'Unable Payment', value: 'Unable Payment'},
    ],
    relationship_to_cnee: [
        {label: 'Brother-in-law', value: 'Brother-in-law'},
        {label: 'Brother - Kuya', value: 'Brother - Kuya'},
        {label: 'Cashier', value: 'Cashier'},
        {label: 'Cousin - Pinsan', value: 'Cousin - Pinsan'},
        {label: 'Daughter', value: 'Daughter'},
        {label: 'Driver', value: 'Driver'},
        {label: 'Employee', value: 'Employee'},
        {label: 'Father-in-law', value: 'Father-in-law'},
        {label: 'Father - Tatay', value: 'Father - Tatay'},
        {label: 'Houseboy', value: 'Houseboy'},
        {label: 'Husband - Asawang Lalaki', value: 'Husband - Asawang Lalaki'},
        {label: 'Maid - Kasambahay', value: 'Maid - Kasambahay'},
        {label: 'Mother-in-law', value: 'Mother-in-law'},
        {label: 'Mother - Nanay', value: 'Mother - Nanay'},
        {label: 'Nephew - Pamangkin', value: 'Nephew - Pamangkin'},
        {label: 'Niece', value: 'Niece'},
        {label: 'None', value: 'None'},
        {label: 'Officemate - Katrabaho', value: 'Officemate - Katrabaho'},
        {label: 'Receptionist', value: 'Receptionist'},
        {label: 'Secretary', value: 'Secretary'},
        {label: 'Security Guard', value: 'Security Guard'},
        {label: 'Sister-in-law', value: 'Sister-in-law'},
        {label: 'Sister - Ate', value: 'Sister - Ate'},
        {label: 'Son', value: 'Son'},
        {label: 'Uncle', value: 'Uncle'},
        {label: 'Wife - Asawang Babae', value: 'Wife - Asawang Babae'},
    ],
    time: [
        { id : '', name : 'Select...' },
        { id : '00:00', name : '00:00'},
        { id : '00:30', name : '00:30'},
        { id : '01:00', name : '01:00'},
        { id : '01:30', name : '01:30'},
        { id : '02:00', name : '02:00'},
        { id : '02:30', name : '02:30'},
        { id : '03:00', name : '03:00'},
        { id : '03:30', name : '03:30'},
        { id : '04:00', name : '04:00'},
        { id : '04:30', name : '04:30'},
        { id : '05:00', name : '05:00'},
        { id : '05:30', name : '05:30'},
        { id : '06:00', name : '06:00'},
        { id : '06:30', name : '06:30'},
        { id : '07:00', name : '07:00'},
        { id : '07:30', name : '07:30'},
        { id : '08:00', name : '08:00'},
        { id : '08:30', name : '08:30'},
        { id : '09:00', name : '09:00'},
        { id : '09:30', name : '09:30'},
        { id : '10:00', name : '10:00'},
        { id : '10:30', name : '10:30'},
        { id : '11:00', name : '11:00'},
        { id : '11:30', name : '11:30'},
        { id : '12:00', name : '12:00'},
        { id : '12:30', name : '12:30'},
        { id : '13:00', name : '13:00'},
        { id : '13:30', name : '13:30'},
        { id : '14:00', name : '14:00'},
        { id : '14:30', name : '14:30'},
        { id : '15:00', name : '15:00'},
        { id : '15:30', name : '15:30'},
        { id : '16:00', name : '16:00'},
        { id : '16:30', name : '16:30'},
        { id : '17:00', name : '17:00'},
        { id : '17:30', name : '17:30'},
        { id : '18:00', name : '18:00'},
        { id : '18:30', name : '18:30'},
        { id : '19:00', name : '19:00'},
        { id : '19:30', name : '19:30'},
        { id : '20:00', name : '20:00'},
        { id : '20:30', name : '20:30'},
        { id : '21:00', name : '21:00'},
        { id : '21:30', name : '21:30'},
        { id : '22:00', name : '22:00'},
        { id : '22:30', name : '22:30'},
        { id : '22:00', name : '22:00'},
        { id : '23:00', name : '23:00'},
        { id : '23:30', name : '23:30'},
    ],
    precise_time: HOURS.map((hour, index) => {
        return MINUTES.map((minute, indx) => {
            return {
                id:hour+':'+minute,
                name:hour+':'+minute,
            }
        }) 
    })
}
