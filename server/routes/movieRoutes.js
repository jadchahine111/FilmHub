const express = require('express');
const movieController = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');
const { cacheMiddleware } = require('../middlewares/cachingMiddleware');

const router = express.Router();

// Route to fetch popular movies
router.get('/popular', protect, cacheMiddleware, movieController.getPopularMovies);

// Route to fetch now playing movies
router.get('/now-playing', protect, cacheMiddleware, movieController.getNowPlayingMovies);

// Route to fetch all movies from the database
router.get('/all', protect, cacheMiddleware, movieController.fetchAllMovies);

// Route to fetch a specific movie by TMDB ID
router.get('/:tmdbId', protect, cacheMiddleware, movieController.fetchMovieByIdApi);

// Route to fetch movie reviews
router.get('/:movieId/reviews', protect, cacheMiddleware, movieController.getMovieReviews);

// Route to search for movies
router.get('/search', protect, cacheMiddleware, movieController.searchMoviesApi);

module.exports = router;
