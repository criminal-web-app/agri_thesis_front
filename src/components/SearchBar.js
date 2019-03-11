import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { SyncLoader } from 'react-spinners';
import { Helpers, gDp } from '../helpers/helpers'

import { FaSearchengin, FaSearch} from 'react-icons/fa'

class SearchBar extends Component {
    render() {
        const { query, placeholder, loading, didSearch, onChangeQuery, addOn={}, didSelectDropdownItem, didToggleAddOn, toggleAdvancedSearch, haveAdvancedSearch=true, className='' } = this.props // props
        addOn.selected = addOn.selected
        addOn.values = addOn.values || []
        return (
            <div>
                <Form
                    onSubmit={(e) => {
                        (document.getElementsByClassName('rt-tbody')[0] || {}).scrollTop = 0
                        didSearch(e)
                    }}>
                    <InputGroup>
                        <Input 
                            className={`form-control-sm-font-size ${className}`}
                            name="key"
                            type="text"
                            value={query}
                            onChange={(e) => {
                                onChangeQuery(e)
                            }}
                            placeholder={placeholder}/>
                        <InputGroupAddon addonType="append">
                            <Button
                                className="form-control-sm-font-size"
                                disabled={loading}
                                color="primary"
                                >
                            {!loading && (<span>Search</span>)}
                            {loading && (
                                <SyncLoader
                                    size={4}
                                    loading={loading}>
                                </SyncLoader>
                            )}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </div>
        );
    }
}

SearchBar.propTypes = {
    query: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    loading: PropTypes.bool,
    didSearch: PropTypes.func,
    onChangeQuery: PropTypes.func.isRequired,
};

export default SearchBar;