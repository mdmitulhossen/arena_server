const express = require('express');
const productController = require('./../controllers/productController');
const router = express.Router();
const shopAuthController = require('./../controllers/shopAuthController');
const reviewController = require('./../controllers/reviewController');
const userAuthController = require('./../controllers/userAuthController');


router.get('/', productController.getAllProduct);
router.get('/latest', productController.getLatestProducts);
router.get('/topRated', productController.getTopRatedProducts);
router.get('/addDummy', 
        shopAuthController.protect, 
        productController.addDummyProducts
    );

router.post('/search', productController.searchProduct);

router.get('/:id', productController.getProductById);



router.post('/', 
        shopAuthController.protect, 
        productController.addProduct
    );

// router.post('/addDesign', shopAuthController.protect, productController.addDesign);

// router.post('/addShopDesign', shopAuthController.protect, productController.addShopDesign);

router.delete('/:id', 
        shopAuthController.protect, 
        productController.deleteProductById
    );
router.patch('/:id', 
        shopAuthController.protect, 
        productController.updateProductById
    );
// router.get('/latest', productController.getLatestProducts);

// Get the reviwes...
router.get('/:pid/reviews', reviewController.getAllReviews);
router.post('/:pid/reviews', 
        userAuthController.protect, 
        reviewController.addReview
    );

module.exports = router;