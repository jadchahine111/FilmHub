const express = require('express');
const userController = require('../controllers/userController.js') ;
const { getUserActivity } = require('../controllers/activityController.js') ;
const { cacheMiddleware } = require('../middlewares/cachingMiddleware');

const { protect } = require('../middlewares/authMiddleware'); // Adjust the path as necessary

const router = express.Router();

router.get('/profile', protect, cacheMiddleware, userController.fetchUserInfo);
router.put('/profile', protect, cacheMiddleware, userController.updateUserProfile);
router.get('/predict-favorite-genre', cacheMiddleware, protect, userController.predictFavoriteGenre);
router.get('/activity', protect, cacheMiddleware, getUserActivity);
router.get('/watchlist', protect, cacheMiddleware, userController.getWatchlist);
router.get('/reviews', protect, cacheMiddleware, userController.getUserReviews);
router.post('/:tmdbId/review', protect, cacheMiddleware,  userController.addReview);
router.delete('/:tmdbId/watchlist', protect, cacheMiddleware,  userController.removeFromWatchlist);



router.post('/:tmdbId/watchlist', protect, cacheMiddleware, userController.addToWatchlist);




module.exports = router;