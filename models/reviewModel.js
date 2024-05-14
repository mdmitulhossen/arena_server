const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
  },

  product : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },

  rating : {
    type : Number, 
    min : [0, 'Rating can not be less than 0.'],
    max : [5, 'Rating can not be greater than 5.'],
    default : 0, 
  },

  message: {
    type: String, 
    maxlength: [500, 'Review must be limited to 500 characters.'],
  }
}, {
  toJSON : { virtuals : true }
});


const Review = mongoose.model('review', reviewSchema);
module.exports = Review;

