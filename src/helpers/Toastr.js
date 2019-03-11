import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
 
class Toastr extends Component {
    state = {
        showToast : false
    }
    notify = () => { 
        const { message, position, type, onClose } = this.props 
        // type = info, warn, error, success, default
        // top position = TOP_RIGHT, TOP_LEFT, TOP_CENTER
        // bottom position = BOTTOM_RIGHT, BOTTOM_LEFT, BOTTOM_CENTER
        toast[type](message, {
            position: toast.POSITION[position],
            onOpen: onClose
        })
    }
    render () {
        const { closeTime, visible } = this.props
        if (visible) this.notify()
        return (
            <div>
                <ToastContainer autoClose={closeTime} /> 
            </div>
        )
    }
}

export default Toastr