const User = require('../models/userModel');
const Auth = require('./rootAuthController');

exports.signup = Auth.signup(User);
exports.login = Auth.login(User);
exports.protect = Auth.protect(User);
exports.restrictTo = Auth.restrictTo;
exports.forgotPassword = Auth.forgotPassword(User);
exports.resetPassword = Auth.resetPassword(User);
exports.updateMyPassword = Auth.updateMyPassword(User);
