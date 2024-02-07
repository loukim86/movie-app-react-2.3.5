import React, { Component } from 'react';
import { format } from 'date-fns';
import './MovieCard.css';

export default class MovieCard extends Component {
  render() {
    const movie = this.props.movie;
    const imgPath = 'https://image.tmdb.org/t/p/w500/';
    let movieDate = movie.releaseDate !== '' ? format(new Date(movie.releaseDate), 'MMMM d, yyyy') : '';
    const movieGenres = this.props.movieGenres;
    const movieGenresType = movieGenres.map((item) => {
      if (item !== '') {
        return (
          <span className="movie-card__genre__type" key={item + movie.id}>
            {item}
          </span>
        );
      }
    });

    return (
      <>
        <div className="movie-card">
          <div>
            <img src={imgPath + movie.poster} className="movie-card__image" />
          </div>
          <div className="movie-card-text">
            <div className="movie-card-text__header">
              <p className="movie-card-text__title">{movie.title}</p>
            </div>
            <p className="movie-card__date">{movieDate}</p>
            <div>{movieGenresType}</div>
            <p className="movie-card-text__overview">{movie.overview}</p>
          </div>
        </div>
      </>
    );
  }
}
