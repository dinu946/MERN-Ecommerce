const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware.js');
const { getProducts, createProducts, getProductsByid, updateProducts, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
//all products 
router.route('/').get(getProducts).post(protect, admin,upload.single('image') ,createProducts);
//spacafic products
router.route('/:id').get(getProductsByid).put(protect, admin,upload.single('image'), updateProducts).delete(protect, admin, deleteProduct);


module.exports = router;