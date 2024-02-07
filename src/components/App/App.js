import React, { Component } from 'react';
import { Layout, Spin, Alert, Space } from 'antd';

import MovieService from '../../services/MovieService';
import MovieCard from '../MovieCard/MovieCard';
import SearchPanel from '../SearchPanel/SearchPanel';
import MoviePagination from '../MoviePagination/MoviePagination';
import NetworkError from '../NetworkError/NetworkError';
import './App.css';

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  state = {
    movies: [],
    genres: [],
    loading: true,
    error: null,
    totalMovies: 0,
    page: 1,
    search: '',
  };

  componentDidMount() {
    this.fetchAllMovies();
    this.fetchGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page || prevState.search !== this.state.search) {
      this.fetchAllMovies(this.state.page, this.state.search);
    }
  }

  cutOffDescription(text) {
    text = text.trim();
    let words = text.split(' ');
    return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : text;
  }

  data = new MovieService();

  fetchAllMovies(pageNumber, search) {
    this.data
      .getAllMovies(pageNumber, search)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message);

        const movies = results.map((movie) => ({
          id: movie.id,
          gendreIds: [...movie.genre_ids],
          title: movie.title,
          poster: movie.poster_path,
          overview: this.cutOffDescription(movie.overview),
          releaseDate: movie.release_date,
        }));

        const totalMovies = results.total_results;

        this.setState({
          movies: movies,
          loading: false,
          error: null,
          totalMovies,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
          totalMovies: 0,
        });
      });
  }

  fetchGenres() {
    this.data
      .getMoviesGenres()
      .then((results) => {
        if (results instanceof Error) throw new Error(results);

        const genres = results.map((genre) => ({
          id: genre.id,
          name: genre.name,
        }));

        this.setState({
          genres: genres,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
        });
      });
  }

  changeCurrentPage = (page) => {
    this.setState({
      page: page,
      loading: true,
    });
  };

  changeSearch = (search) => {
    this.setState({
      search,
      loading: true,
    });
  };

  render() {
    const loading = this.state.loading ? (
      <Content className="spinner">
        <Spin tip="Loading" size="large">
          <div className="spin-content" />
        </Spin>
      </Content>
    ) : null;

    const movies = !this.state.loading ? <MovieDisplay movies={this.state.movies} genres={this.state.genres} /> : null;

    const error =
      this.state.error !== null ? (
        <Space align="center">
          <Alert message={this.state.error.message} type="error" closable />
        </Space>
      ) : null;

    return (
      <Layout className="layout">
        <NetworkError>
          <Content className="content-all-movies">
            <Header className="header">
              <SearchPanel changeSearch={this.changeSearch} />
              {error}
            </Header>
            {loading}
            {movies}
            <Footer className="footer">
              <MoviePagination
                defaultCurrent={1}
                totalMovies={this.state.totalMovies}
                changePage={this.changeCurrentPage}
              />
            </Footer>
          </Content>
        </NetworkError>
      </Layout>
    );
  }
}

const MovieDisplay = ({ movies, genres }) => {
  if (movies.length === 0) {
    return (
      <Content>
        <h1 className="data-absent">No Data Found</h1>
      </Content>
    );
  } else {
    const movieCardData = movies.map((el) => {
      const movieGenreType = el.genreIds
        .map((genreId) => genres.find((genre) => genre.id === genreId))
        .filter((genre) => genre && genre.name)
        .map((genre) => genre.name);

      return <MovieCard key={el.id} movieGenres={movieGenreType} movie={el} />;
    });

    return <Content className="movie-card-panel">{movieCardData}</Content>;
  }
};
