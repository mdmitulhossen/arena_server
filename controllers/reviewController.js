const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Review = require('./../models/reviewModel');
const Product = require('./../models/productModel');


// User, Product, Rating, Review message.

exports.addReview = catchAsync(async (req, res, next) => {

    const {user} = req;
    const {product} = req;

    if (user == undefined) {
        return next(new AppError ("You need to be logged In to add reviews.", 401));
    } 

    const review = {
        user: req.user._id,
        product: req.params.pid,
        rating: req.body.rating,
        message: req.body.message,
    }

    const saved = await Review.create(review);
    // Find the product 
    // push the review
    // Update the ratings.
    const product_up = await Product.findById(req.params.pid);
    product_up.reviews.push(saved._id);
    product_up.starCount += saved.rating;
    product_up.rating = product_up.starCount / product_up.reviews.length;
    const updatedProduct = await product_up.save();

    console.log(review);
    console.log(updatedProduct);
    res.status(200).json({
        status:"success",
        data: saved,
        updated: updatedProduct,
    });    
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    console.log(req.params.pid);
    res.status(200).json({
        status:"Processing Route GET/reviews",
    });
});