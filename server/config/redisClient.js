const Redis = require('ioredis');

const redis = new Redis({
    host: '127.0.0.1', // Replace with your Redis host
    port: 6379,        // Default Redis port
});

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis connection error:', err));

module.exports = redis;
