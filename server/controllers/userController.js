const { User } = require('../models/userModel');
const { Movie } = require('../models/movieModel');
const { Activity } = require('../models/activityModel');
const { Review } = require('../models/reviewModel');
const axios = require('axios');
const { broadcastActivity } = require('./activityController');
const config = require('../config/config');
const { setCache } = require('../middlewares/cachingMiddleware');


const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Get user profile
 const fetchUserInfo = async (req, res) => {
    const cacheKey = `user_info_${req.user.id}`;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userInfo = {
            name: user.name,
            email: user.email,
            googleId: user.googleId,
            watchlist: user.watchlist,
            phoneNumber: user.phoneNumber,
        };

        await setCache(cacheKey, userInfo, 3600); // Cache for 1 hour
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ error: 'Failed to fetch user information' });
    }
};

 const predictFavoriteGenre = async (req, res) => {
    const cacheKey = `favorite_genre_${req.user.id}`;
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.watchlist.length === 0) {
            return res.status(200).json({ message: 'Watchlist is empty', predictedFavoriteGenres: [] });
        }

        const genreCounts = {};
        const tmdbApiKey = process.env.TMDB_API_KEY;

        for (const movie of user.watchlist) {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie}?api_key=${tmdbApiKey}&language=en-US`);
                const movieDetails = response.data;

                movieDetails.genres.forEach(genre => {
                    genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
                });
            } catch (error) {
                console.error(`Error fetching movie details for ID ${movie}:`, error.response ? error.response.data : error.message);
            }
        }

        const sortedGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre]) => genre);

        const result = {
            predictedFavoriteGenres: sortedGenres || [],
            genreCounts: genreCounts
        };

        await setCache(cacheKey, result, 3600); // Cache for 1 hour
        res.json(result);
    } catch (error) {
        console.error('Error predicting favorite genre:', error);
        res.status(500).json({ error: 'Error predicting favorite genre' });
    }
};

 const getUserReviews = async (req, res) => {
    const cacheKey = `user_reviews_${req.user.id}`;
    try {
        const reviews = await Review.find({ user: req.user.id }).sort({ createdAt: -1 });

        if (!reviews || reviews.length === 0) {
            return res.status(200).json({ error: 'No reviews found for this user' });
        }

        const formattedReviews = await Promise.all(reviews.map(async (review) => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${review.movie}`, {
                    params: {
                        api_key: config.tmdbApiKey,
                    },
                });

                const movieTitle = response.data.title || 'Unknown Title';

                return {
                    id: review._id,
                    movieId: review.movie || null,
                    movieTitle: movieTitle,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt
                };
            } catch (error) {
                console.error('Error fetching movie by TMDb ID:', error.response ? error.response.data : error.message);
                return {
                    id: review._id,
                    movieId: review.movie || null,
                    movieTitle: 'Error fetching title',
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt
                };
            }
        }));

        await setCache(cacheKey, { reviews: formattedReviews }, 3600); // Cache for 1 hour
        res.status(200).json({ reviews: formattedReviews });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ error: 'Error fetching user reviews' });
    }
};

 const getWatchlist = async (req, res) => {
    const cacheKey = `watchlist_${req.user.id}`;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userWatchlist = user.watchlist || [];

        if (userWatchlist.length === 0) {
            return res.status(200).json({ message: 'Watchlist is empty' });
        }

        const watchlistWithDetails = await Promise.all(userWatchlist.map(async (tmdbId) => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
                    params: {
                        api_key: config.tmdbApiKey,
                    },
                });

                return {
                    tmdbId: tmdbId,
                    movieTitle: response.data.title || 'Unknown Title',
                    releaseYear: response.data.release_date ? new Date(response.data.release_date).getFullYear() : 'N/A',
                    overview: response.data.overview || 'No overview available',
                    releaseDate: response.data.release_date || 'N/A',
                    runtime: response.data.runtime || 'N/A',
                    posterImage: response.data.poster_path ? `${tmdbImageBaseUrl}${response.data.poster_path}` : null
                };
            } catch (error) {
                console.error(`Error fetching details for tmdbId: ${tmdbId}`, error);
                return {
                    tmdbId: tmdbId,
                    movieTitle: 'Error fetching title',
                };
            }
        }));

        await setCache(cacheKey, { watchlist: watchlistWithDetails }, 3600); // Cache for 1 hour
        res.json({ watchlist: watchlistWithDetails });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

 const updateUserProfile = async (req, res) => {
    try {
        const { name, phoneNumber, bio } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name || user.name;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.bio = bio || user.bio;

        await user.save();

        res.status(200).json({
            message: 'User profile updated successfully',
            user: {
                name: user.name,
                phoneNumber: user.phoneNumber,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

 const addToWatchlist = async (req, res) => {
    try {
        const { tmdbId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${config.tmdbApiKey}&language=en-US`;
        const movieResponse = await axios.get(tmdbUrl);

        if (!movieResponse.data || !movieResponse.data.id) {
            return res.status(404).json({ message: 'Movie not found on TMDB' });
        }

        if (user.watchlist.includes(tmdbId)) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }

        user.watchlist.push(tmdbId);
        await user.save();

        const activity = new Activity({
            type: 'watchlist',
            user: userId,
            tmdbId: tmdbId,
            movieTitle: movieResponse.data.title,
            date: new Date()
        });

        await activity.save();
        broadcastActivity(activity);

        res.status(201).json({ message: 'Movie added to watchlist', activity });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

 const removeFromWatchlist = async (req, res) => {
    try {
        const { tmdbId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.watchlist.indexOf(Number(tmdbId));
        if (index === -1) {
            return res.status(404).json({ message: 'Movie not found in watchlist' });
        }
        user.watchlist.splice(index, 1);

        await user.save();

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${config.tmdbApiKey}&language=en-US`;
        const movieResponse = await axios.get(tmdbUrl);

        if (!movieResponse.data || !movieResponse.data.id) {
            return res.status(404).json({ message: 'Movie not found on TMDB' });
        }

        const activity = new Activity({
            type: 'removeWatchlist',
            user: userId,
            tmdbId: tmdbId,
            movieTitle: movieResponse.data.title,
            date: new Date()
        });

        await activity.save();
        broadcastActivity(activity);

        res.status(200).json({ message: 'Movie removed from watchlist successfully', watchlist: user.watchlist });
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

 const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { tmdbId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${config.tmdbApiKey}&language=en-US`;
        const movieResponse = await axios.get(tmdbUrl);

        if (!movieResponse.data || !movieResponse.data.id) {
            return res.status(404).json({ message: 'Movie not found on TMDB' });
        }

        let movie = await Movie.findOne({ tmdbId });
        if (!movie) {
            movie = new Movie({
                tmdbId: tmdbId,
                title: movieResponse.data.title,
                posterPath: movieResponse.data.poster_path,
                releaseDate: movieResponse.data.release_date,
                genres: movieResponse.data.genres.map(genre => genre.name),
                averageRating: 0,
                reviewCount: 0,
                reviews: []
            });
            await movie.save();
        }

        const existingReview = await Review.findOne({ user: userId, movie: tmdbId });
        if (existingReview) {
            return res.status(200).json({ message: 'You have already reviewed this movie' });
        }

        const newReview = new Review({
            user: user._id,
            movie: tmdbId,
            rating,
            comment
        });

        await newReview.save();

        movie.reviews.push(newReview._id);
        movie.reviewCount += 1;
        await movie.save();

        const activity = new Activity({
            type: 'review',
            user: userId,
            movieTitle: movieResponse.data.title,
            date: new Date()
        });

        await activity.save();
        broadcastActivity(activity);

        res.status(201).json({ message: 'Review added successfully', activity });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { fetchUserInfo, predictFavoriteGenre, getUserReviews, getWatchlist, updateUserProfile, addToWatchlist, removeFromWatchlist, addReview, };