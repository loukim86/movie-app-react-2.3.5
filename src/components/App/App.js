import React, { Component } from 'react';
import { Layout, Spin } from 'antd';

import MovieService from '../../services/MovieService';
import MovieCard from '../MovieCard/MovieCard';

import './App.css';

const { Content } = Layout;

export default class App extends Component {
  state = {
    movies: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.showAllMovies();
  }

  cutOffDescription = (text) => {
    text = text.trim();
    let words = text.split(' ');
    return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : text;
  };

  showAllMovies = (pageNumber) => {
    const movieService = new MovieService();
    movieService.getAllMovies(pageNumber).then((results) => {
      if (results instanceof Error) {
        this.setState({
          error: results,
          loading: false,
        });
      } else {
        const movies = results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          overview: this.cutOffDescription(movie.overview),
          releaseDate: movie.release_date,
        }));
        const totalMovies = results.length;
        this.setState({
          movies,
          loading: false,
          error: null,
          totalMovies,
        });
      }
    });
  };

  render() {
    const { loading, movies, error } = this.state;

    return (
      <Layout className="layout">
        {loading ? (
          <Content className="spinner">
            <Spin tip="Loading" size="large">
              <div className="spinner-content" />
            </Spin>
          </Content>
        ) : (
          <Content className="content-all-movies movie-card-panel">
            {error ? null : movies.length === 0 ? (
              <h1 className="no-data">No Data Found</h1>
            ) : (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            )}
          </Content>
        )}
      </Layout>
    );
  }
}
