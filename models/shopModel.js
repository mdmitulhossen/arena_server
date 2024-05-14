const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const shopSchema = new mongoose.Schema ({
  name : {
    type : String,
    required: [true, 'A shop must have a name'],
    unique: [true, 'A shop with this name already exists.'],
    minlenth: [1, 'Shop must have a name.'],
    maxlength: [20, 'Shop name must be at most 20 characters'],
  },

  email: {
    type: String,
    required: [true, 'Please enter your Email'],
    unique: [true, 'This email is not acceptable'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    trim: true,
  },
  phone: { 
    type: String,
    unique: true,
    validate: [validator.isNumeric, 'Phone Number must only conatain numbers and not associated with any other accounts.'],
    // select: false,
  },
  verified : {
    type : Boolean, 
    default : false,
  },
  orders: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
      },
      quantity: {
        type: Number,
      },
      size: {
        type: String,
      }
    }
  ],

  transactions: {
    balance: {
      type: Number,
      default: 0,
    },
    withdrawn: {
      type: Number,
      default: 0,
    }
  },

  tradeLisence : {
    type : String,
    // unique : [true, 'This trade lisence has alredy a shop in our site.'],
    // required: false, 
  },
  password: { 
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  photo: {
    type: String,
    default: 'https://i.ibb.co/XC3yQbY/default.jpg',
  },
  role : {
    type: String,
    enum: ['shop'],
    default : 'shop',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  customDesigns: {
    colors: [{type: String}],
    designs: [{type: String}], 
    price : {type: Number},
  },
  productSaleCount: {
    type: Number,
    default : 0,
  }
  // TODO: Most SOld product route.
});


shopSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined, 
  next();
});

shopSchema.methods.isCorrectPassword = async function(givenpass, realpass) {
  return await bcrypt.compare(givenpass, realpass);
};

shopSchema.methods.passwordHasChangedAfter = function (createdAt) {
  if (this.passwordChangedAt) {
    return true;
  }
  return false;
}; 

shopSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(this);
  return resetToken;
};

const Shop = mongoose.model('shop', shopSchema);
module.exports = Shop;