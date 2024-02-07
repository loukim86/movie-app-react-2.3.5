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
    return <Input placeholder="Type For Search Movie" onChange={this.debounceSearch} />;
  }
}
