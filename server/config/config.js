// config.js
require('dotenv').config(); // Ensure you load environment variables from .env file

module.exports = {
  tmdbApiKey: process.env.TMDB_API_KEY || 'e092d8570589c59b2c99dc9aaa1b2eae',
  mongoURI: process.env.MONGO_URI || 'your_default_mongo_uri', // Optional default for MongoDB
};
