// const AppError = require('./../utils/appError');

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   console.log(message);
//   return new AppError(message, 400);
// };

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);

//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

// const handleJsonWebTokenError = (err) => {
//   err.statusCode = 401;
//   err.message = 'You are not Logged in. Please LogIn to get access.';
//   return err;
// }

// module.exports = (err, req, res, next) => {

//   console.log('ERROR HOISE : ');
//   console.log(err);
  
//   err.status = err.status || "Error";
//   err.statusCode = err.statusCode || 500;

//   if (process.env.NODE_ENV == 'development') {
//     // console.log('Im in development bois');
//   } else {    
//     return sendProductionError(err);
//   }

//   let error = {...err};
//   error.errmsg = err.message;
//   if (error.code == 11000) error = handleDuplicateFieldsDB(err);
//   // if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error);
//   console.log(error, error.message, "message");
//   // error.message = error.message;

//   res.status(error.statusCode).json({
//     status: error.status,
//     error, 
//     message: error.message,
//   });
// };



const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = Object.keys(err.keyValue).map(el => el);
  console.log(value);

  const message = `Duplicate ${value}. Please use another one!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    // console.log(error, err.message);
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
    error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};