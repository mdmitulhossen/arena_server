const express = require('express');

const router = express.Router();
const customDesignController = require('../controllers/customDesignController');
const shopAuthController = require('../controllers/shopAuthController')

router.post('/', shopAuthController.protect, customDesignController.addCustomDesign);


module.exports = router;