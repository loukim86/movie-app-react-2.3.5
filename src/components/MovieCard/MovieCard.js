import React, { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import './MovieCard.css';

export default class MovieCard extends Component {
  setRateValue = (value) => {
    this.props.setRateValue(this.props.movie.id, value, this.props.movieRate);
  };

  renderGenres = () => {
    const { movieGenres } = this.props;
    return movieGenres.map(
      (item) =>
        item !== '' && (
          <span className="movie-card__content__genre" key={item + this.props.movie.id}>
            {item}
          </span>
        )
    );
  };

  renderRateDesktop = () => {
    const { movieRate } = this.props;

    let className = 'movie-card__votes';

    if (movieRate > 0 && movieRate < 3) {
      className += ' movie-card__votes--low';
    } else if (movieRate >= 3 && movieRate < 5) {
      className += ' movie-card__votes--medium';
    } else if (movieRate >= 5 && movieRate < 7) {
      className += ' movie-card__votes--high';
    } else if (movieRate >= 7) {
      className += ' movie-card__votes--top';
    }

    return movieRate > 0 && <p className={className}>{movieRate}</p>;
  };

  renderRateMobile = () => {
    const { movieRate } = this.props;

    let className = 'movie-card__votes mobile-count-votes';

    if (movieRate > 0 && movieRate < 3) {
      className += ' movie-card__votes--low';
    } else if (movieRate >= 3 && movieRate < 5) {
      className += ' movie-card__votes--medium';
    } else if (movieRate >= 5 && movieRate < 7) {
      className += ' movie-card__votes--high';
    } else if (movieRate >= 7) {
      className += ' movie-card__votes--top';
    }

    return movieRate !== 0 && <p className={className}>{movieRate}</p>;
  };

  render() {
    const { movie, movieRate } = this.props;
    const imgPath = 'https://image.tmdb.org/t/p/w500/';
    const movieDate = movie.releaseDate !== '' ? format(new Date(movie.releaseDate), 'MMMM d, yyyy') : '';

    return (
      <>
        <div className="movie-card">
          <div>
            <img src={imgPath + movie.poster} className="movie-card__image" alt={movie.title} />
          </div>
          <div className="movie-card__content">
            <div className="movie-card__content__header">
              <p className="movie-card__content__title ">{movie.title}</p>
              {this.renderRateDesktop()}
            </div>
            <p className="movie-card__content__date">{movieDate}</p>
            <div>{this.renderGenres()}</div>
            <p className="movie-card__content__overview">{movie.overview}</p>
            <div className="movie-card__content__stars">
              <Rate
                className="movie-card__content__stars-size"
                allowHalf
                defaultMovie={0}
                onChange={this.setRateValue}
                value={Number(movieRate)}
                count={10}
              />
            </div>
          </div>
        </div>
        <div className="mobile-card">
          <div className="mobile-card__movie">
            <img src={imgPath + movie.poster} className="mobile-card__image" alt={movie.title} />
            <div className="mobile-card__movie__content">
              <p className="mobile-card__movie__content__header">{movie.title}</p>
              <p className="movie-card__text__date mobile-card__movie__date">{movieDate}</p>
              <div className="mobile-card__movie__genres">{this.renderGenres()}</div>
            </div>
            <div>{this.renderRateMobile()}</div>
          </div>
          <div className="mobile-card__description">
            <p className="mobile-card__description__overview">{movie.overview}</p>
          </div>
          <div className="mobile-card__stars">
            <Rate
              className="movie-card__text__stars-size"
              allowHalf
              defaultMovie={0}
              onChange={this.setRateValue}
              value={Number(movieRate)}
              count={10}
            />
          </div>
        </div>
      </>
    );
  }
}
