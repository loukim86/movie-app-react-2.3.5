import React, { useState, useEffect } from 'react';
import { Layout, Spin, Alert } from 'antd';

import MovieService from '../../services/MovieService';
import MovieCard from '../MovieCard/MovieCard';

import './App.css';

const { Content } = Layout;

const App = () => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const showAllMovies = async (pageNumber) => {
      const movieService = new MovieService();
      try {
        const results = await movieService.getAllMovies(pageNumber);

        const updatedMovies = results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          overview: cutOffDescription(movie.overview),
          releaseDate: movie.release_date,
        }));

        setMovies(updatedMovies);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    showAllMovies();
  }, []);

  const cutOffDescription = (text) => {
    text = text.trim();
    let words = text.split(' ');
    return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : text;
  };
  return (
    <Layout className="layout">
      <Content className="content-all-movies movie-card-panel">
        {loading ? (
          <Spin size="large" tip="Loading" className="loading-spin">
            <div className="spin-content" />
          </Spin>
        ) : (
          <>
            {error ? (
              <Alert message="Error" description="Error loading data" type="error" showIcon />
            ) : !onlineStatus ? (
              <div className="no-internet-warning">
                <Alert
                  message="No Internet Connection"
                  description="Please check your internet connection and try again."
                  type="warning"
                  showIcon
                />
              </div>
            ) : movies.length === 0 ? (
              <h1 className="no-data">No Data Found</h1>
            ) : (
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            )}
          </>
        )}
      </Content>
    </Layout>
  );
};

export default App;
