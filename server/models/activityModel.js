const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['watchlist', 'review', 'removeWatchlist'] },
    movieTitle: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
