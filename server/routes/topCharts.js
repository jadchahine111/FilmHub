const express = require('express');
const topChartsController = require('../controllers/topChartsController');
const { cacheMiddleware } = require('../middlewares/cachingMiddleware');

const { protect } = require('../middlewares/authMiddleware'); // Adjust the path as necessary


const router = express.Router();

router.get('/popularity', protect, cacheMiddleware,  topChartsController.getMostPopularMovies);

// Route to fetch top-rated movies
router.get('/top-rated', protect, cacheMiddleware,  topChartsController.getTopRatedMovies);



module.exports = router;