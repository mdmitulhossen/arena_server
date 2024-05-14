const Shop = require('../models/shopModel');
const Auth = require('./rootAuthController');

exports.signup = Auth.signup(Shop);
exports.login = Auth.login(Shop);
exports.forgotPassword = Auth.forgotPassword(Shop);
exports.resetPassword = Auth.resetPassword(Shop);
exports.updateMyPassword = Auth.updateMyPassword(Shop);
exports.restrictTo = Auth.restrictTo;
exports.protect = Auth.protect(Shop);

