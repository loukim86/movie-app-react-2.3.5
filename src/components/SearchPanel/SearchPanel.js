import React, { Component } from 'react';
import { Input } from 'antd';
import debounce from 'lodash/debounce';

import './SearchPanel.css';

export default class SearchPanel extends Component {
  searchOnChange = (e) => {
    this.props.changeSearch(e.target.value);
  };
  debounceSearch = debounce(this.searchOnChange, 300);
  render() {
    return <Input placeholder="Type To Search For Movie" onChange={this.debounceSearch} className="search-panel" />;
  }
}
