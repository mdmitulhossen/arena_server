const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


// Add Address. 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
    maxlength: [50, 'Name must have maximum of 50 characters'],
    minlength: [5, 'Name must have at least 5 characters'],
    trim: true,
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
    select: false, 
  },
  password: { 
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: String,
    default: 'https://i.ibb.co/DCbcNX1/default.jpg',
  },
  dateCreated: { type: Date, default: Date.now },
  role: {
    type: String, 
    default: 'user',
    enum: ['user', 'admin'],
  }
  //     orders: [{ id: mongoose.Schema.Types.ObjectId }],
  //     favItems: [{ id: mongoose.Schema.Types.ObjectId }],
  //     Address: [{ id: mongoose.Schema.Types.ObjectId }],
}); 


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});


userSchema.methods.isCorrectPassword = async function(givenpass, realpass) {
  return await bcrypt.compare(givenpass, realpass);
};

userSchema.methods.passwordHasChangedAfter = function (createdAt) {
  if (this.passwordChangedAt) {
    return true;
  }
  return false;
}; 

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(this);;
  return resetToken;
};

const User = mongoose.model('user', userSchema);
module.exports = User;
