const catchAsync = require("../utils/catchAsync");
const CustomDesign = require('../models/customDesignModel');
const Shop = require('../models/shopModel');

exports.addCustomDesign = catchAsync(async (req, res, next) => {
    const shop = await Shop.findById(req.user.id);

    // console.log('Added Custom Desing to shop');
    
    if (req.body.price) {
        shop.customDesigns.price = req.body.price;
    }

    if (req.body.colors) {
        for (let color of req.body.colors) {
            shop.customDesigns.colors.push(color);
        }
    }

    if (req.body.designs) {
        for (let design of req.body.designs) {
            shop.customDesigns.designs.push(design);
        }
    }

    const updated_shop = await shop.save();


    res.status(200).json({
        status: "Success",
        data: updated_shop,
    });
});

exports.placeOrderCustomDesign = catchAsync(async (req, res, next) => {
    const shop = await Shop.findById(req.user.id);

    // console.log('Added Custom Desing to shop');
    
    if (req.body.price) {
        shop.customDesigns.price = req.body.price;
    }

    if (req.body.colors) {
        for (let color of req.body.colors) {
            shop.customDesigns.colors.push(color);
        }
    }

    if (req.body.designs) {
        for (let design of req.body.designs) {
            shop.customDesigns.designs.push(design);
        }
    }

    const updated_shop = await shop.save();


    res.status(200).json({
        status: "Success",
        data: updated_shop,
    });
});

exports.getDesings = catchAsync(async(req, res, next) => {
    const shop = await Shop.findById(req.user.id);

    res.status(200).json({
        status: "Success",
        data: shop.customDesigns,
    });
});