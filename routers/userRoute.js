const express = require('express');
const userController = require('./../controllers/userController');
const userAuthController = require('../controllers/userAuthController');

const router = express.Router();

router.post('/signup', userAuthController.signup);
router.post('/login', userAuthController.login);
router.post('/forgotPassword', userAuthController.forgotPassword);
router.patch('/resetPassword/:token', userAuthController.resetPassword);

// Make Sure User Logged In.
router.use(userAuthController.protect);

router.post('/updateme', 
    userAuthController.protect, 
    userController.updateMe
);

router.get('/me', userController.getMe);
router.patch('/updateMyPassword', userAuthController.updateMyPassword);
router.get('/', userAuthController.restrictTo('admin'), userController.getAllUsers);

module.exports = router; 