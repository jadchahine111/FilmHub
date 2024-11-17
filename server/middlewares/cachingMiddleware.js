const redis = require('../config/redisClient');

const cacheMiddleware = async (req, res, next) => {
    try {
        const key = req.originalUrl; // Use the URL as the cache key
        const cachedData = await redis.get(key);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        next();
    } catch (error) {
        console.error('Redis cache error:', error);
        next();
    }
};

const setCache = async (key, value, ttl = 3600) => {
    try {
        await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting Redis cache:', error);
    }
};

module.exports = { cacheMiddleware, setCache };
