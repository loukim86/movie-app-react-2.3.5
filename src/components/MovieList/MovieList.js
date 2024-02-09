import React from 'react';
import { Layout } from 'antd';

import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

const { Content } = Layout;

const MovieList = ({ movies, genres, guestMovie, setRateValue }) => {
  if (movies.length === 0) {
    return (
      <Content>
        <h1 className="data-absent">No Data Found</h1>
      </Content>
    );
  } else {
    const cardData = movies.map((item) => {
      let movieGenres = [];
      for (let genreArr of item.genreIds) {
        movieGenres.push(genres.find((genreEl) => genreEl.id === genreArr));
      }
      let movieGenreNames = movieGenres.map((i) => {
        if (i) {
          if (i.name) {
            return i.name;
          }
        } else {
          return '';
        }
      });
      let movieRate = 0;
      if (!item.votes) {
        const movieRated = guestMovie.find((element) => element.id === item.id);
        if (movieRated !== undefined) {
          movieRate = movieRated.votes;
        }
      } else {
        movieRate = item.votes;
      }

      return (
        <MovieCard
          key={item.id}
          movieRate={movieRate}
          movie={item}
          movieGenres={movieGenreNames}
          setRateValue={setRateValue}
        />
      );
    });
    return <Content className="movie-card-panel">{cardData}</Content>;
  }
};

export default MovieList;
