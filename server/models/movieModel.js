const mongoose = require('mongoose');

// Define movie schema
const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true, unique: true, index: true },
  title: { type: String },
  posterPath: { type: String },
  releaseDate: { type: Date },
  genres: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Array of ObjectId references to Review
}, { timestamps: true });

// Create Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
