const catchAsync = require('../utils/catchAsync');
const Product = require('./../models/productModel');
const AppError = require('./../utils/appError');

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate('shop');
  res.status(200).json({
    status: 'success',
    data: products,
  });
}); 

exports.getProductById = catchAsync(async (req, res, next) => {
  
  const product = await Product.findById(req.params.id).populate(['shop', 'reviews']);
  if (product == null || product == undefined) {
    return next(new AppError('Product Not Found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: product,
  });

});

exports.updateProductById = catchAsync(async(req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product == null) {
    return next(new AppError('Product can not be found!.', 404));
  }

  if (product.shop.toString() != req.params.id) {
    return next(new AppError('You are not authorized to delete this product.', 401));
  }

  res.status(200).json({
    status: "Route not implemented Yet.",
    data: product,
  });
});

exports.deleteProductById = catchAsync(async(req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product == null) {
    return next(new AppError('Product can not be found!.', 404));
  }

  if (product.shop.toString() != req.params.id) {
    return next(new AppError('You are not authorized to delete this product.', 401));
  }

  const del = await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "Product deleted.",
    data: del,
  });
});


exports.addDesign = catchAsync(async (req, res, next) => {
});

exports.addProduct = catchAsync(async (req, res, next) => {

  const { user } = req;

  if (!user.verified) {
    return next(new AppError('Please verify your shop to add product.', 400));
  }

  const product = {
    name : req.body.name,
    category: req.body.category,
    price : req.body.price,
    shop : req.user._id,    
    sizes: req.body.sizes,  
    imageUrls: req.body.imageUrls,
  };
  
  // console.log(product);
  if (req.body.discount) product.discount = req.body.discount;
  if (req.body.description) product.description = req.body.description;

  const saved = await Product.create(product);
  
  res.status(200).json({
    status: 'success',
    data: saved, 
  });
});

exports.updateProductById = catchAsync(async (req, res, next) => {
  // if (req.params.id)
  res.status(200).json({
    status: 'success',
    message: 'This route is not completed yet.',
  });
});

exports.getLatestProducts = catchAsync(async (req, res, next) => {

  const products = await Product.find().sort({createdAt: -1});

  res.status(200).json({
    status: "Processing...",
    data: products,
  })
});

exports.getTopRatedProducts = catchAsync(async (req, res, next) => {

  const products = await Product.find().sort({rating: -1});

  res.status(200).json({
    status: "Processing...",
    data: products,
  });

});


exports.searchProduct = catchAsync(async(req, res, next) => {

  const query = req.body.productName;
  const queryParts = query.split(/\s+/);
  const regexParts = queryParts.map(part => new RegExp(part, 'i'));

  const products = await Product.find({ $and: regexParts.map(part => ({ name: part })) });

  res.status(200).json({
    status: "Processing...",
    data: products,
  });
});


const dummyData = require('./../utils/addDummyProducts');
exports.addDummyProducts = catchAsync(async (req, res, next) => {

  let products = dummyData.dummyData;
  
  products.forEach(product => {
    product.shop = req.user.id;
  });

  const addedProducts = await Product.insertMany(products);

  res.status(200).json({
    status: "Added to database....",
    insertedProducts: addedProducts,
  });

});