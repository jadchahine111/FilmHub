const Activity = require('../models/activityModel');
const WebSocket = require('ws');

const getUserActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

      await setCache(cacheKey, activities, 300);


    res.json({ recentActivity: activities });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const broadcastActivity = (activity) => {
  if (broadcastActivity.wss) {
    broadcastActivity.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(activity));
      }
    });
  }
};

module.exports = {
  getUserActivity,
  broadcastActivity
};