import React, { Component } from 'react'
import { InputGroupAddon, Input, FormFeedback, FormGroup, ListGroupItem } from 'reactstrap'
import { AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation'
import { Helpers, lS, DefaultState, TOAST, OPTIONS, gDp  } from '../helpers/helpers'

class inputDisplays extends Component {

    onInputChange = (elementId) => {
        const element = document.getElementById(elementId)
        if (element) {
            element.addEventListener("keydown", function(e) {
                if ([69, 187, 189, 109].includes(e.keyCode)) {
                    e.preventDefault()
                }
            })
        }
    }
    onInputKeyUp = (elementId) => {
        const element = document.getElementById(elementId)
        if (element) {
            element.addEventListener("keyup", function(e) {
                if (e.target.value.length > 10){
                    e.target.value = e.target.value.slice(0, 10)
                } 
            })
        }
    }

    validateInputSelectError = (input, data) => {
        if (input.isRequired) {
            if (input.selectedValue==='' || typeof input.selectedValue === 'undefined') {
                input.error = { 
                    message: 'Required'
                }
            } else {
                delete input.error
            }
        } 
    }

    render() {
        const { data, inputs, selectedValue, showTitle } = this.props
        let timeout = null
        return (
            <div>
                {Object.keys(inputs).map((key, idx) => (
                    <div key={idx}>
                        {showTitle && <strong>{key}</strong>}
                        {inputs[key].map((input, idx) => {
                            input.isUnique = typeof input.isUnique !== 'undefined' ? input.isUnique : true
                            let inputOptionFind = []
                            if (input.type === 'select-dropdown') {
                                input.options = (input.options || []).map((item)=>(
                                    input.returnLabel ? { ...item, label: item.label, value: item.label } : 
                                    typeof input.customLabel === 'function' ? { ...item, ...input.customLabel(item)  } :
                                    { ...item }
                                ))
                                if (input.isUnique) input.options = Helpers.removeDuplicates(input.options)
                                inputOptionFind = input.options.filter(o=>(
                                        !input.isMulti ? o.value === input.selectedValue
                                                       : input.selectedValue.split(input.separator||';').includes(o.value)
                                    )
                                ) || []
                                input.selectedOption = inputOptionFind 
                            }
                            this.validateInputSelectError(input, data)
                            return (
                                <div key={idx}>
                                    {input.type === 'select' ? (
                                        <div style={input.style}>
                                            <AvField
                                                bsSize={"sm"}
                                                required={input.isRequired}
                                                name={input.name}
                                                type={input.type}
                                                label={input.label}
                                                placeholder={input.label}
                                                autoComplete={input.name}
                                                value={data ? data[input.name] : ""}
                                                onChange={(e)=>{ gDp(input,'handleInputChange',()=>()=>{})({input, data: data[input.name]})(e) }}
                                                disabled={  
                                                    input.disabled || false
                                                        // typeof input.disabled  !== 'undefined' 
                                                        //     ? input.disabled : data[input.name] 
                                                        //     ? false : true
                                                }
                                                {...(input.hasGrid) ? {grid:input.gridStyle} : {}}
                                            >
                                                { input.hasEmptyOption && (<option value=''>Select...</option>)}
                                                {input.options.map((option, idx) => (
                                                    <option 
                                                        key={idx} 
                                                        value={option.value || option[(input.optionKeys||{}).value]} 
                                                        disabled={(option.value || (option[(input.optionKeys||{}).value])) ? false : true } >
                                                        {option.label || option[(input.optionKeys||{}).label]}
                                                    </option>
                                                ))}
                                            </AvField>
                                        </div>
                                    ) 
                                    : (input.type === 'file') ? (
                                        <div style={input.style}>
                                            <AvField
                                                bsSize={"sm"}
                                                required={input.isRequired}
                                                name={input.name}
                                                type={'file'}
                                                label={input.label}
                                                onChange={(e)=>{ gDp(input,'handleInputChange',()=>()=>{})(e) }}
                                                accept="image/gif, image/jpeg, image/png"
                                            >
                                            </AvField>
                                        </div>
                                    )
                                    : (input.type !== 'select' && !input.inputGroup) ? (
                                        <div style={input.style}>
                                            <AvField
                                                {...(input.elementId) ? {id:input.elementId} : {}}
                                                className={
                                                    ( ` ${input.className} `)
                                                }
                                                bsSize={"sm"}
                                                required={input.isRequired}
                                                name={input.name}
                                                type={input.type}
                                                label={input.label}
                                                placeholder={input.label}
                                                autoComplete={input.name}
                                                value={data ? data[input.name] : ""}
                                                validate={input.validators || {}}
                                                disabled={input.disabled}
                                                onChange={(e)=>{
                                                    this.onInputChange(input.elementId)
                                                    if (input.hasOnChange) {
                                                        input.handleInputChange(e.target.value)
                                                    }
                                                }}
                                                {...(input.hasGrid) ? {grid:input.gridStyle} : {}}
                                            />
                                        </div>
                                    )
                                    : (input.type !== 'select' && input.inputGroup) && (
                                        <div style={input.style}>
                                            <label>{input.label}</label>
                                            <AvGroup className="input-group input-group-sm">
                                                {input.inputGroupProps.pre && 
                                                    <InputGroupAddon addonType="prepend" >
                                                        { input.inputGroupProps.pre }
                                                    </InputGroupAddon>} 
                                                <AvInput 
                                                    {...(input.elementId) ? {id:input.elementId} : {}}
                                                    className={
                                                        ( ` ${input.className} `)
                                                    }
                                                    bsSize={"sm"}
                                                    required={input.isRequired}
                                                    name={input.name}
                                                    type={input.type}
                                                    placeholder={input.label}
                                                    autoComplete={input.name}
                                                    value={data ? data[input.name] : ""} 
                                                    validate={input.validators || {}}
                                                    disabled={input.disabled}
                                                    // step={input.validators.step.value}
                                                    {...(input.validators.min) ? {min:input.validators.min.value} : {}}
                                                    onChange={this.onInputChange(input.elementId)}
                                                    onKeyUp={this.onInputKeyUp(input.elementId)}
                                                    style={{borderRadius: '0px 4px 4px 0px'}}
                                                /> 
                                                {input.inputGroupProps.suf && 
                                                    <InputGroupAddon addonType="append">
                                                        { input.inputGroupProps.suf }
                                                    </InputGroupAddon>} 
                                                <AvFeedback>{ input.validators.required.errorMessage }</AvFeedback>
                                            </AvGroup>
                                        </div>
                                    )
                                    } 
                                </div> 
                            )
                        })}
                    </div>
                ))} 
            </div>
        );
    }
}

export default inputDisplays;