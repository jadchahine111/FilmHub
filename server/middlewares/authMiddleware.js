const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path as needed
const { refreshToken } = require('../controllers/authController'); // Adjust the path as needed

// Protect middleware to verify JWT from cookies and handle token refresh
const protect = async (req, res, next) => {
  try {
    // Get tokens from HTTP-only cookies
    const accessToken = req.cookies.accessToken;
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!accessToken && !refreshTokenCookie) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (accessToken) {
      try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (error) {
        // Access token is invalid or expired, try to refresh
        if (!refreshTokenCookie) {
          return res.status(401).json({ message: 'Access token expired and no refresh token' });
        }
      }
    }

    // At this point, either there was no access token or it was invalid
    // Attempt to refresh the token
    const user = await User.findOne({ refreshToken: refreshTokenCookie });
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    try {
      // Verify the refresh token
      jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET);

      // Generate a new access token
      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      // Set the new access token as an HTTP-only cookie
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      // Attach user info to the request
      req.user = { id: user._id };
      next();
    } catch (error) {
      // Refresh token is invalid
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  } catch (err) {
    console.error('Error in protect middleware:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { protect };