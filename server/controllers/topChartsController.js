const axios = require('axios');
const config = require('../config/config');
const { setCache } = require('../middlewares/cachingMiddleware');

const tmdbBaseUrl = 'https://api.themoviedb.org/3';

// Fetch popular movies (Daily and Weekly)
const getMostPopularMovies = async (req, res) => {
  const cacheKey = 'popular_movies';
  try {
    const response = await axios.get(`${tmdbBaseUrl}/movie/popular`, {
      params: { 
        api_key: config.tmdbApiKey, 
        language: 'en-US', 
        page: 1 
      },
    });
    const top5PopularMovies = response.data.results.slice(0, 5);  // Get the top 5 movies
    
    // Cache the result
    await setCache(cacheKey, top5PopularMovies, 3600); // Cache for 1 hour

    res.status(200).json(top5PopularMovies);  // Return only the top 5 movies
  } catch (error) {
    console.error('Error fetching popular movies:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

// Fetch top-rated movies
const getTopRatedMovies = async (req, res) => {
  const cacheKey = 'top_rated_movies';
  try {
    const response = await axios.get(`${tmdbBaseUrl}/movie/top_rated`, {
      params: { 
        api_key: config.tmdbApiKey, 
        language: 'en-US', 
        page: 1 
      },
    });
    const top5TopRatedMovies = response.data.results.slice(0, 5);  // Get the top 5 movies
    
    // Cache the result
    await setCache(cacheKey, top5TopRatedMovies, 3600); // Cache for 1 hour

    res.status(200).json(top5TopRatedMovies);  // Return only the top 5 movies
  } catch (error) {
    console.error('Error fetching top-rated movies:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch top-rated movies' });
  }
};

module.exports = { getMostPopularMovies, getTopRatedMovies };