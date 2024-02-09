import React, { Component } from 'react';
import { Layout, Spin, Alert, Space, Tabs } from 'antd';

import MovieService from '../../services/MovieService';
import MovieList from '../MovieList/MovieList';
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
    guestSessionId: '',
    guestSessionExpires: '',
    guestMovies: [],
    totalGuestMovies: 0,
    guestPage: 1,
    needUpdate: false,
  };
  data = new MovieService();

  componentDidMount() {
    this.loadGenres();
    this.loadAllMovies();
    this.createGuestSession();
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, guestPage, search, guestSessionId, needUpdate, movies, guestMovies } = this.state;

    if (prevState.page !== page || prevState.search !== search) {
      this.loadAllMovies(page, search);
    }

    if (prevState.guestPage !== guestPage || prevState.guestSessionId !== guestSessionId) {
      this.loadRatedMovies(guestPage, guestSessionId);
    }

    if (prevState.guestSessionId !== guestSessionId) {
      this.loadRatedMovies(guestPage, guestSessionId);
    }

    if (needUpdate !== false) {
      const movieId = needUpdate[0];
      let updatedMovies = [...movies];
      let updatedGuestMovies = [...guestMovies];

      const movieIndex = updatedMovies.findIndex((element) => element.id === movieId);

      if (movieIndex !== -1) {
        updatedMovies[movieIndex].votes = needUpdate[1];

        if (updatedGuestMovies.find((element) => element.id === movieId)) {
          const updatedGuestMovie = updatedGuestMovies.map((movie) =>
            movie.id !== movieId ? movie : { ...movie, votes: needUpdate[1] }
          );

          this.setState({ guestMovies: updatedGuestMovie, needUpdate: false });
        } else {
          this.setState({ guestMovies: [...updatedGuestMovies, updatedMovies[movieIndex]], needUpdate: false });
        }
      }
    }
  }

  cutOffDescription(text) {
    text = text.trim();
    let words = text.split(' ');
    return words.length > 20 ? words.slice(0, 20).join(' ') + '...' : text;
  }

  createGuestSession() {
    this.data.createGuestSession().then((results) => {
      if (results.success)
        this.setState({ guestSessionId: results.guest_session_id, guestSessionExpires: results.expires_at });
    });
  }
  getRatedMovies(pageNumber, guestId) {
    const ratedMovies = this.data
      .getGuestMovies(pageNumber, guestId)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message);
        const movies = results.results.map((movie) => {
          return {
            id: movie.id,
            genreIds: [...movie.genre_ids],
            title: movie.title,
            poster: movie.poster_path,
            votes: movie.rating,
            overview: this.cutOffDescription(movie.overview),
            releaseDate: movie.release_date,
          };
        });
        const totalGuestMovies = results.total_results;
        return { movies, totalGuestMovies };
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
          totalGuestMovies: 0,
        });
      });
    return ratedMovies;
  }
  async loadRatedMovies(pageNumber, guestId) {
    const data = await this.getRatedMovies(pageNumber, guestId);
    this.setState({
      guestMovies: data.movies,
      loading: false,
      error: null,
      totalGuestMovies: data.totalGuestMovies,
    });
  }
  loadAllMovies(pageNumber, search) {
    this.data
      .getAllMovies(pageNumber, search)
      .then((results) => {
        if (results instanceof Error) throw new Error(results.message);
        const movies = results.results.map((movie) => {
          return {
            id: movie.id,
            genreIds: [...movie.genre_ids],
            title: movie.title,
            poster: movie.poster_path,
            overview: this.cutOffDescription(movie.overview),
            votes: 0,
            releaseDate: movie.release_date,
          };
        });
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
  loadGenres() {
    this.data
      .getMoviesGenres()
      .then((results) => {
        if (results instanceof Error) throw new Error(results);
        const genres = results.map((genre) => {
          return {
            id: genre.id,
            name: genre.name,
          };
        });
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
  changePage = (page) => {
    this.setState({
      page: page,
      loading: true,
    });
  };
  changeRatedPage = (page) => {
    this.setState({
      guestPage: page,
      loading: true,
    });
  };
  changeSearch = (search) => {
    this.setState({
      search,
      loading: true,
    });
  };
  setRateValue = (id, value) => {
    this.data.postGuestMovies(id, value, this.state.guestSessionId).then((result) => {
      if (result.success === true) {
        this.setState({
          needUpdate: [id, value],
        });
      }
    });
  };
  render() {
    const { loading, movies, guestMovies, error, totalMovies, totalGuestMovies, genres } = this.state;
    const loadingContent = loading ? (
      <Content className="spinner">
        <Spin tip="Loading" size="large">
          <div className="spin-content" />
        </Spin>
      </Content>
    ) : null;
    const moviesContent = !loading ? (
      <MovieList movies={movies} genres={genres} guestMovie={guestMovies} setRateValue={this.setRateValue} />
    ) : null;
    const guestMoviesContent = !loading ? (
      <MovieList movies={guestMovies} genres={genres} setRateValue={this.setRateValue} />
    ) : null;
    const errorContent =
      error !== null ? (
        <Space align="center">
          <Alert message={this.state.error.message} type="error" closable />
        </Space>
      ) : null;
    const items = [
      {
        label: 'Search',
        key: 'item-1',
        children: (
          <Content className="content-all-movies">
            <Header className="header">
              <SearchPanel changeSearch={this.changeSearch} />
              {errorContent}
            </Header>
            {loadingContent}
            {moviesContent}
            <Footer className="footer">
              <MoviePagination defaultCurrent={1} totalMovies={totalMovies} changePage={this.changePage} />
            </Footer>
          </Content>
        ),
      },
      {
        label: 'Rated',
        key: 'item-2',
        children: (
          <Content className="rated">
            {loadingContent}
            {guestMoviesContent}
            <Footer className="footer">
              <MoviePagination defaultCurrent={1} totalMovies={totalGuestMovies} changePage={this.changeRatedPage} />
            </Footer>
          </Content>
        ),
      },
    ];
    return (
      <Layout className="layout">
        <NetworkError>
          <Tabs items={items} centered defaultActiveKey={1} />
        </NetworkError>
      </Layout>
    );
  }
}
