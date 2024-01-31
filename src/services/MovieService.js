import SomeError from './SomeError';

export default class MovieService {
  _moviePopularUrl = 'https://api.themoviedb.org/3';

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

  async getAllMovies(pageNumber = 1) {
    try {
      const movieUrl = `${this._moviePopularUrl}/movie/popular?language=en-US&page=${pageNumber}`;
      const res = await fetch(movieUrl, this._options);
      if (!res.ok) {
        throw new SomeError('Ошибка ' + res.status);
      }
      const response = await res.json();

      return response.results;
    } catch (error) {
      return error;
    }
  }
}
