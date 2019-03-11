import React, { Component } from 'react'
import { Modal as Mod, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import PropTypes from 'prop-types'
import Loader from './Loader'

class Modal extends Component {
    isOnLast = () => {
        return this.props.onStep === this.props.length
    }
    render() {
        const { size, height, isOpen, toggle, modalTitle, modalBody, modalFooter, onClosed, isLoading=false } = this.props
        return (
            <div>
                <Mod isOpen={isOpen} toggle={toggle} size={size} onClosed={onClosed}>
                    <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                    <ModalBody style={{
                        height: `${height ? height : "auto"}`
                    }}>
                        {modalBody}
                    </ModalBody>
                    <ModalFooter>
                        {modalFooter}
                    </ModalFooter>
                    <Loader
                        message={(
                            <div>
                                {/* <h4>Fetching reports</h4> */}
                                <p>{'Please wait...'}</p>
                            </div>
                        )}
                        isLoading={isLoading}
                    />
                </Mod>
            </div>
        );
    }
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    buttons: PropTypes.array,
    modaTitle: PropTypes.string,
    modalBody: PropTypes.element,
    modalFooter: PropTypes.element,
    next: PropTypes.func,
    prev: PropTypes.func,
};

export default Modal;