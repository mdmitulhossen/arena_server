const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Shop = require('../models/shopModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ customer: req.user._id });
  // console.log(orders);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
}
);

exports.addCustomOrder = catchAsync(async (req, res, next) => {
  const order = {
    customer: req.user._id,
    customOrder : req.body.customOrder,
    totalPrice: req.body.totalPrice,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
  };
  console.log(order,"sfjusfsa");
  const data = await Order.create(order);

  res.status(200).json({
    status: 'success',
    data: data,
  });

});

exports.getShopOrders = catchAsync(async (req, res, next) => {
  const orders = await Shop.find({ _id: req.user._id });
  // console.log(orders);

  res.status(200).json({
    status: 'success',
    results: orders.orders,
    data: orders.orders,
  });
});

exports.placeOrder = catchAsync(async (req, res, next) => {

  if (req.body.customDesignUrl) {

    const order = {
      customer: req.user._id,
      customDesignUrl: req.body.customDesignUrl,
      totalPrice: totalPrice,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
    };
    await Order.create(order);

    res.status(200).json({
      status: "success",
      data: order,
    });

  }

  let { orderItems } = req.body;

  if (orderItems.length === 0) {
    return next(new AppError('No products found to place Order! Please add to cart.', 400));
  }
  const products = orderItems.map((orderItem) => { return orderItem.product });
  // console.log(products);

  const ordered = await Product.find({ _id: { $in: products } });
  // console.log(ordered);

  let totalPrice = 0;
  for (let i = 0; i < orderItems.length; i++) {
    totalPrice += (orderItems[i].quantity * (ordered[i].price - ordered[i].price * (ordered[i].discount / 100.0)));
  }

  const order = {
    customer: req.user._id,
    orderItems: orderItems,
    totalPrice: totalPrice,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
  }

  // console.log(ordered);
  const orderplaced = await Order.create(order);


  for (let i = 0; i < orderItems.length; i++) {
    // Find the shop
    const shop = await Shop.findById(ordered[i].shop);
    // add order to order list
    shop.orders.push(orderItems[i]);
    await shop.save();

    // Find product and update inventory
    const product = await Product.findById(orderItems[i].product);
    // console.log(product);

    // for (let size of product.sizes) {
    //   if (size.size == orderItems[i].size) {
    //     size.quantity = size.quantity - orderItems[i].quantity;
    //   }
    // }

    // const updatedProduct = await product.save();
    await product.save();
    // console.log("Updatd Product -> ", updatedProduct);
  }


  res.status(200).json({
    status: "success",
    data: orderplaced
  });
});

exports.myOrders = catchAsync(async (req, res, next) => {

});


exports.viewOrderById = catchAsync(async (req, res, next) => {

  const order = await Order
    .findById(req.params.id)
    .populate(['customer', 'orderItems.product']);
  console.log(order);

  if (!order) {
    return next(new AppError('No order found with that id!', 404));
  }

  if (req.user._id.toString() != order.customer._id.toString()) {
    return next(new AppError('You are not authorized to view this order.', 401));
  }

  res.status(200).json({
    status: 'success',
    data: order,
  });

});