import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PulseLoader } from 'react-spinners'

class Loader extends Component {
    render() {
        const { isLoading, message = null } = this.props
        return (
            <div className="loader"
                style={
                    {
                        display: isLoading ? "inline-grid" : "none"
                    }
                }>
                {message && (message)}
                <PulseLoader
                    color={"#5DBD48"}
                    loading={isLoading}
                />
            </div>
        );
    }
}

Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    message: PropTypes.element,
};

export default Loader;