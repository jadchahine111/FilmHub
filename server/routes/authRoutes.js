const express = require('express');
const { signup, login, verifyEmail, checkVerificationStatus } = require('../controllers/authController');
const router = express.Router();
const authController = require("../controllers/authController")
const { protect } = require('../middlewares/authMiddleware');


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', protect, authController.signout);

router.get('/verify-email/:token', authController.verifyEmail);
router.get('/check-verification/:email', authController.checkVerificationStatus);
router.post('/refresh', authController.refreshToken);
router.get('/check', authController.checkAuth)



module.exports = router;
