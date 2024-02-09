import SomeError from './SomeError';

export default class MovieService {
  _moviePopularUrl = 'https://api.themoviedb.org/3';
  _movieGenresUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
  _movieGuestSessionUrl = 'https://api.themoviedb.org/3/authentication/guest_session/new';

  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MWU3NWY0MGY4MGVlZTZjOWJkMWQxMGYyNTNjZTU2YiIsInN1YiI6IjY1YjdhMGE4YTI4NGViMDEzMDBhNGU2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WdAJs01TDV6T1KL5uQ-sWRNFf0BZREXtGuHVjIPg5oo',
    },
    withCredentials: true,
  };
  _apiKey = '41e75f40f80eee6c9bd1d10f253ce56b';

  async getAllMovies(pageNumber = 1, search = '') {
    try {
      let movieUrl = this._moviePopularUrl;
      if (search !== '') {
        movieUrl += `/search/movie?query=${search}&language=en-US&page=`;
      }
      if (search === '') {
        movieUrl += '/movie/popular?language=en-US&page=';
      }
      const res = await fetch(movieUrl + pageNumber, this._options);
      if (res.status === 204) {
        return {};
      }
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

  async createGuestSession() {
    try {
      const res = await fetch(this._movieGuestSessionUrl, this._options);
      if (!res.ok) {
        throw new SomeError('Error number is ' + res.status);
      }
      const resJson = await res.json();
      return resJson;
    } catch (error) {
      return error;
    }
  }

  async getGuestMovies(pageNumber = 1, id) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/guest_session/${id}/rated/movies?language=en-US&page=${pageNumber}&api_key=${this._apiKey}`,
        {
          method: 'GET',
          redirect: 'follow',
        }
      );
      if (!res.ok) {
        throw new SomeError('Error number is ' + res.status);
      }
      const resJson = await res.json();
      return resJson;
    } catch (error) {
      return error;
    }
  }

  async postGuestMovies(id, rating, guestSessionId) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${guestSessionId}&api_key=${this._apiKey}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ value: rating }),
        }
      );
      const resJson = await res.json();
      return resJson;
    } catch (error) {
      return error;
    }
  }
}
