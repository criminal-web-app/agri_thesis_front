import React, { Component } from 'react'
import { PulseLoader } from 'react-spinners'
import { Button } from 'reactstrap'

import arrowlogo from 'assets/right-arrow-circle.png'
import 'styles/Login.css'

class ButtonSpinner extends Component {
    render() {
        const { isLoading = false, size, spinnerColor = "#000", spinnerSize, block = true} = this.props
        return (
            <div>
                {isLoading && (
                    <div className="text-center">
                        <PulseLoader
                            color={spinnerColor} 
                            loading={isLoading} 
                            size={spinnerSize}
                        />
                    </div>
                )}
                {!isLoading && (
                    <Button type="submit" className="next"
                        color="link"
                        size={size}
                        block={block}
                    >
                
                        <i className='fa'>
                            <img className="img"
                            src={arrowlogo}
                            alt="Submit"/>
                        </i>
                    </Button>
                )}
            </div>
        );
    }
}

export default ButtonSpinner;