const axios = require('axios');
const config = require('../config/db');

const TMDB_API_KEY = process.env.TMDB_API_KEY; // Load API key from environment variables

const fetchMovieById = async (tmdbId) => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
    params: {
      api_key: config.tmdbApiKey,
    },
  });
  return response.data;
};

// Function to search movies based on query parameters
async function searchMovies(queryParams) {
    const { query, year, genre, minRating } = queryParams;
    const baseUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}`;
  
    // Constructing the search URL
    const params = new URLSearchParams({
      query,
      year,
      with_genres: genre,
      // The API does not directly support min rating, 
      // but we can filter it after receiving results if needed.
    });
  
    try {
      const response = await axios.get(`${baseUrl}&${params}`);
      return response.data.results; // Return the movie results
    } catch (error) {
      console.error('Error fetching movies from TMDB:', error);
      throw new Error('Failed to fetch movies from TMDB');
    }
  }


  const fetchPopularMovies = async () => {
    const baseUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`; // Include the API key in the URL
    const response = await axios.get(baseUrl);
    return response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date.split("-")[0], // Extract year from release date
      rating: movie.vote_average,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '', // Construct poster URL
    }));
  };

module.exports = {
  fetchMovieById,
  searchMovies,
  fetchPopularMovies
};

