const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel');
const { fetchMovieById, searchMovies } = require('../utils/tmdbApi');
const axios = require('axios');
const config = require('../config/config');
const { setCache } = require('../middlewares/cachingMiddleware');

const tmdbBaseUrl = 'https://api.themoviedb.org/3';

// Fetch all popular movies
const getPopularMovies = async (req, res) => {
  const cacheKey = 'popular_movies';
  try {
    const baseUrl = `${tmdbBaseUrl}/movie/popular?api_key=${config.tmdbApiKey}`;
    const response = await axios.get(baseUrl);
    const movies = response.data.results.map(movie => ({
      tmdbId: movie.id,
      title: movie.title,
      year: movie.release_date.split('-')[0],
      rating: movie.vote_average,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    }));

    // Save movies to MongoDB
    await Movie.insertMany(movies, { ordered: false });

    // Cache the result
    await setCache(cacheKey, movies, 3600); // Cache for 1 hour

    res.json(movies);
  } catch (error) {
    console.error('Error fetching popular movies:', error.message || error);
    res.status(500).json({ error: 'Could not fetch and store popular movies' });
  }
};

// Fetch all now playing movies
const getNowPlayingMovies = async (req, res) => {
  const cacheKey = 'now_playing_movies';
  try {
    const baseUrl = `${tmdbBaseUrl}/movie/now_playing?api_key=${config.tmdbApiKey}`;
    const response = await axios.get(baseUrl);
    const movies = response.data.results.map(movie => ({
      tmdbId: movie.id,
      title: movie.title,
      year: movie.release_date.split('-')[0],
      rating: movie.vote_average,
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    }));

    // Save movies to MongoDB
    await Movie.insertMany(movies, { ordered: false });

    // Cache the result
    await setCache(cacheKey, movies, 3600); // Cache for 1 hour

    res.json(movies);
  } catch (error) {
    console.error('Error fetching now playing movies:', error.message || error);
    res.status(500).json({ error: 'Could not fetch and store now playing movies' });
  }
};

// GET /api/movies?page=2&limit=20
const fetchAllMovies = async (req, res) => {
  const { page = 1, limit = 20, search = '', genre = '', yearFrom = 1900, yearTo = 2023, minRating = 0 } = req.query;
  const cacheKey = `all_movies_${page}_${limit}_${search}_${genre}_${yearFrom}_${yearTo}_${minRating}`;

  try {
    // Fetch genres from TMDB
    const genreUrl = `${tmdbBaseUrl}/genre/movie/list?api_key=${config.tmdbApiKey}`;
    const genreResponse = await axios.get(genreUrl);
    const genreMap = genreResponse.data.genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});

    // Fetch movies
    let baseUrl = `${tmdbBaseUrl}/discover/movie?api_key=${config.tmdbApiKey}&page=${page}`;
    
    // Add search query if provided
    if (search) {
      baseUrl = `${tmdbBaseUrl}/search/movie?api_key=${config.tmdbApiKey}&query=${encodeURIComponent(search)}&page=${page}`;
    }

    // Add other filters
    baseUrl += `&primary_release_date.gte=${yearFrom}-01-01&primary_release_date.lte=${yearTo}-12-31`;
    baseUrl += `&vote_average.gte=${minRating}`;
    if (genre) {
      const genreId = Object.keys(genreMap).find(key => genreMap[key].toLowerCase() === genre.toLowerCase());
      if (genreId) {
        baseUrl += `&with_genres=${genreId}`;
      }
    }

    const movieResponse = await axios.get(baseUrl);

    const movies = movieResponse.data.results.map(movie => ({
      tmdbId: movie.id,
      title: movie.title,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      rating: movie.vote_average,
      genres: movie.genre_ids.map(genreId => genreMap[genreId]),
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    }));

    // Pagination details
    const totalMovies = movieResponse.data.total_results;
    const totalPages = movieResponse.data.total_pages;

    const result = {
      movies,
      currentPage: Number(page),
      totalPages,
      totalMovies,
      moviesPerPage: Number(limit)
    };

    // Cache the result
    await setCache(cacheKey, result, 3600); // Cache for 1 hour

    res.json(result);
  } catch (error) {
    console.error('Error fetching movies:', error.message || error);
    res.status(500).json({ error: 'Could not fetch and store movies' });
  }
};

// Fetch movie by ID (from TMDB)
const fetchMovieByIdApi = async (req, res) => {
  const { tmdbId } = req.params;
  const cacheKey = `movie_${tmdbId}`;

  try {
    const response = await axios.get(`${tmdbBaseUrl}/movie/${tmdbId}`, {
      params: { api_key: config.tmdbApiKey },
    });

    // Cache the result
    await setCache(cacheKey, response.data, 3600); // Cache for 1 hour

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie by ID:', error.message || error);
    res.status(500).json({ error: 'Could not fetch movie by ID' });
  }
};

// Search for movies with filters
const searchMoviesApi = async (req, res) => {
  const { query, year, genre, minRating } = req.query;
  const cacheKey = `search_${query}_${year}_${genre}_${minRating}`;

  try {
    const movies = await searchMovies({ query, year, genre });
    const filteredMovies = movies.filter(movie => movie.vote_average >= minRating);

    // Cache the result
    await setCache(cacheKey, filteredMovies, 3600); // Cache for 1 hour

    res.json(filteredMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get movie reviews
const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  const cacheKey = `reviews_${movieId}`;

  try {
    const numericMovieId = Number(movieId);

    if (isNaN(numericMovieId)) {
      return res.status(400).json({ message: 'Invalid movie ID, must be a number' });
    }

    const reviews = await Review.find({ movie: numericMovieId }).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.status(200).json({ message: 'No reviews found for this movie' });
    }

    // Cache the result
    await setCache(cacheKey, reviews, 3600); // Cache for 1 hour

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

module.exports = {
  getPopularMovies,
  getNowPlayingMovies,
  fetchAllMovies,
  fetchMovieByIdApi,
  searchMoviesApi,
  getMovieReviews,
};