import React, { Component } from 'react';
import { Pagination } from 'antd';

export default class MoviePagination extends Component {
  render() {
    const changeCurrentPage = (page) => {
      this.props.changePage(page);
    };
    const { totalMovies } = this.props;
    return <Pagination defaultCurrent={1} total={totalMovies} pageSize={10} onChange={changeCurrentPage} />;
  }
}
