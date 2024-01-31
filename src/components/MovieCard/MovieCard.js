import React from 'react';
import './MovieCard.css';
import { format } from 'date-fns';

export default function MovieCard({ movie }) {
  const imgUrl = 'https://image.tmdb.org/t/p/w500/';
  const movieReleaseDate = movie.releaseDate !== '' ? format(new Date(movie.releaseDate), 'MMMM d, yyyy') : '';

  return (
    <div className="movie-card">
      <div>
        <img src={imgUrl + movie.poster} className="movie-card__image" alt={movie.title} />
      </div>
      <div className="movie-card__text">
        <div className="movie-card-text__header">
          <p className="movie-card-text__title ">{movie.title}</p>
        </div>
        <p className="movie-card-text__date">{movieReleaseDate}</p>
        <span className="movie-card-text__genre">{movie.genre || 'Action'}</span>
        <p className="movie-card-text__overview">{movie.overview}</p>
      </div>
    </div>
  );
}
