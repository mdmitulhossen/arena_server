const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const createToken =  function (id) {
  return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXP_TIME
  });
}; 

const sendToken =  function (user, res) {
  const token = createToken(user._id);

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXP_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true, 
  }

  res.cookie('jwt', token, options);
  res.status(200).json({
    status: 'success',
    token, 
    user, 
  });
};

exports.protect = Model => catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('No token Provided. Bad Request.', 400));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const user = await Model.findById(decoded.id).select('+password');
  console.log(user);

  if (!user) {
    return next(new AppError('No user found or You are not Looged In.', 400));
  }

  if (user.passwordHasChangedAfter(user.iat)) {
    return next(new AppError('Password has been changed. LogIn Again.', 401));
  }
  req.user = user;
  next();
});


exports.login = Model => catchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return next(new AppError('Email or password not provided.', 400));
  }
  const user = await Model.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid Email or Password.'));
  }
  return sendToken(user, res);
});


exports.signup = Model => catchAsync(async(req, res, next) => {
  const data = {
    name : req.body.name, 
    email : req.body.email,
    phone : req.body.phone, 
    password :  req.body.password, 
  };

  const user = await Model.create(data);
  return sendToken(user, res);
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next (new AppError('You are not authorized to make this request', 403));
    }
    next();
  }
};

exports.forgotPassword = Model => catchAsync(async(req, res, next) => {

  // req a mail ase.. 
  const user = await Model.findOne({email : req.body.email});

  console.log(user, req.body.email);
  if (!user) {
    return next(new AppError('No user with that email.', 404));
  }

  let resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave : false });
  // next();
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;


  console.log('resetURL = ', resetURL);

  try {
    await sendEmail({
      email : user.email, 
      subject : 'Password Reset Token. Expires in 10 mins.',
      message, 
    });

    res.status(200).json({
      status:'success',
      message : 'A token has been sent to your email.',
    });
  } catch (ex) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});

    return next(new AppError('There was a problem sending token. Please try again later', 500));
  }
});
 

exports.resetPassword = Model => catchAsync(async(req, res, next) => {
  const hashedPassword = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');

  console.log(req.params);

  const user = await Model.findOne({passwordResetToken : hashedPassword, passwordResetExpires: { $gt: Date.now() } 
  });

  if (!user) {
    return next(new AppError('Invalid Token Provided or time expired.', 403));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return sendToken(user, res);
});

exports.updateMyPassword = Model => catchAsync (async(req, res, next) => {
  const { user } = req;
  
  if (!(await user.isCorrectPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Current Password do not match.', 403));
  }

  user.password = req.body.password;
  await user.save();
 
  console.log(user);
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

