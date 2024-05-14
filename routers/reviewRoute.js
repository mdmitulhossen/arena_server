const express = require('express');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();
const userAuthController = require('./../controllers/userAuthController');


router.post('/', 
        userAuthController.protect, 
        userAuthController.restrictTo('user'), 
        reviewController.addReview
    );
    
router.get('/', reviewController.getAllReviews);

module.exports = router;