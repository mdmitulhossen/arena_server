const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Shop = require('./../models/shopModel');


exports.getTotalItems = catchAsync(async (req, res, next) => {
  const shop = await Product.find({ shop: req.params.pid });


  res.status(200).json({
    status: "success",
    data: shop,
    toatlProducts: shop.length,
  });
});

exports.updateInfo = catchAsync(async (req, res, next) => {
  const shop = await Shop.findById(req.user.id);

  if (req.body.name) shop.name = req.body.name;
  if (req.body.email) shop.email = req.body.email;
  if (req.body.photo) shop.photo = req.body.photo;

  const updatedShop = await shop.save();

  res.status(200).json({
    status: "success",
    data: updatedShop,
  });

});

exports.getMe = catchAsync(async (req, res, next) => {
  const { user } = req;
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: user,
  });
});


exports.getMyProducts = catchAsync(async (req, res, next) => {
  const { user } = req;
  console.log(user);
  const products = await Product.find({ shop: req.user._id });


  res.status(200).json({
    status: 'success',
    results: products.length,
    products,
  });
});

exports.getProductByShopAndCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!(await Shop.findById(id))) {
    return next(new AppError('Invalid Link or the shop does not exist.', 400));
  }

  // const products = await Shop.find({ _id: id });
  // console.log(products);
  const products = await Product.find({ shop: id });

  res.status(200).json({
    status: 'success',
    results: products.length,
    products: products,
  });
});

exports.getAllShops = catchAsync(async (req, res, next) => {
  const allShops = await Shop.find();

  res.status(200).json({
    status: 'success',
    results: allShops.length,
    shops: allShops,
  });
});

exports.getShopById = catchAsync(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    return next(new AppError('No Shop found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    shop,
  });
});


exports.deleteShop = catchAsync(async (req, res, next) => {
  const shop = await Shop.findByIdAndDelete(req.params.id);
  if (!shop) {
    return next(new AppError('There is no shop with that ID.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// This code is not part of the backend API.
// Add dummy Shops

const dummyShopList = require('./../utils/dummyShopData');
exports.addDummyShops = catchAsync(async (req, res, next) => {

  const shopList = dummyShopList.dummyShopData;
  const addedShops = await Shop.insertMany(shopList);

  res.status(200).json({
    status: "Added Shops",
    shops: addedShops,
  })
});