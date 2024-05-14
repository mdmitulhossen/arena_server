const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  customDesignUrl: { type: String },

  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],

  orderTime: { type: Date, default: Date.now },
  totalPrice: { type: Number },

  orderStatus: {
    type: String,
    enum: ['pending', 'cancelled', 'Processing', 'Shipped', 'Delivered'],
    default: 'pending',
  },


  shippingAddress: {
    type: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      }
    }
  },

  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Online'],

  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  }

});


const Order = mongoose.model('order', orderSchema);

module.exports = Order;