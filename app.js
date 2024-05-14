const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require("cors");


// Create App
const app = express();

// cors

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

// set headers
app.use(helmet());

// Enable JSON format
app.use(express.json());
app.use(cookieParser());


// Stats of the incoming request.
app.use(morgan('dev'));

// Protect SQL injection
app.use(mongoSanitize());

// app.com
const userRouter = require('./routers/userRoute');
const shopRouter = require('./routers/shopRoute');
const productRouter = require('./routers/productRoute');
const orderRouter = require('./routers/orderRoute');
const customDesignRouter = require('./routers/customDesignRoute');

// Routes

app.use('/products/addDesign', customDesignRouter);
app.use('/users', userRouter);
app.use('/shops', shopRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can not find the provided url ${req.originalUrl}`, 404));
});

app.use(globalErrorController);

module.exports = app;