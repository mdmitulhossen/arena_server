const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name : {
    type : String, 
    required: [true, 'Product must have a name.'], 
  },

  category : {
    type : String, 
    enum: {
      values : ['tShirt', 'Pant', 'Jersey'],
      message : 'Product must be one of these provided category.'
    },
    required : [true, 'Select a Product Category.'],
  },


  price : {
    type: Number, 
    required : [true, 'A product must have price.'],
    min : [1, 'Price must be greater than 0.'],
  },

  discount : {
    type : Number, 
    default : 0,
    min: [0, 'Discount must be at lest 0%.'],
    max : 100, 
  },

  rating : {
    type : Number, 
    min : [0, 'Rating can not be less than 0.'],
    max : [5, 'Rating can not be greater than 5.'],
    default : 0, 
  },

  starCount: {
    type: Number,
    default: 0,
  },

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shop',
  },

  sizes: [
    {
      size: {
        type: String,
        required: true,
      }, 
      quantity: {
        type: Number,
        min : [0, 'Quantity can not be less than 0.'],
        required: true,
      }
    }
  ],

  reviews : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review',
    }
  ],
  createdAt: { type: Date, default: Date.now },
  imageUrls: [{ type: String }],
  description: {
    type: String,
  }
}, {
  toJSON : { virtuals : true }
});

productSchema.virtual('priceAfterDiscount')
  .get(function() {
    return this.price - (this.price * (this.discount / 100));
  });

const Product = mongoose.model('product', productSchema);
module.exports = Product;

