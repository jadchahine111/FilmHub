// server/models/MovieModel.js
const axios = require('axios');
const Movie = require('./Movie'); // Import the Mongoose model

class MovieModel {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}`;
  }

  async fetchPopularMovies() {
    try {
      const response = await axios.get(this.baseUrl);
      const movies = response.data.results.map(movie => ({
        tmdbId: movie.id,
        title: movie.title,
        year: movie.release_date.split('-')[0], // Extract year from release date
        rating: movie.vote_average,
        posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '', // Construct poster URL
      }));

      // Save movies to MongoDB
      await Movie.insertMany(movies, { ordered: false }); // Ignore duplicates, if any
      return movies;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new Error('Could not fetch popular movies');
    }
  }

  // You can add more methods to retrieve movies from the database
  async getAllMovies() {
    return await Movie.find({});
  }
}

module.exports = MovieModel;
