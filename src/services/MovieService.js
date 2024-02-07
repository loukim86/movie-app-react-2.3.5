import SomeError from './SomeError';

export default class MovieService {
  _moviePopularUrl = 'https://api.themoviedb.org/3';
  _movieGenresUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MWU3NWY0MGY4MGVlZTZjOWJkMWQxMGYyNTNjZTU2YiIsInN1YiI6IjY1YjdhMGE4YTI4NGViMDEzMDBhNGU2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WdAJs01TDV6T1KL5uQ-sWRNFf0BZREXtGuHVjIPg5oo',
    },
    withCredentials: true,
  };

  async getAllMovies(pageNumber = 1, search = '') {
    try {
      let movieUrl = this._moviePopularUrl;
      if (search !== '') {
        movieUrl += `search/movie?query=${search}&language=en-US&page=`;
      }
      if (search === '') {
        movieUrl += 'movie/popular?language=en-US&page=';
      }
      const res = await fetch(movieUrl + pageNumber, this._options);
      if (!res.ok) {
        throw new SomeError('Error number is ' + res.status);
      }
      const resJson = await res.json();
      return resJson;
    } catch (error) {
      return error;
    }
  }

  async getMoviesGenres() {
    try {
      const res = await fetch(this._movieGenresUrl, this._options);
      if (!res.ok) {
        throw new SomeError('Error number is ' + res.status);
      }
      const resJson = await res.json();
      return resJson.genres;
    } catch (error) {
      return error;
    }
  }
}
