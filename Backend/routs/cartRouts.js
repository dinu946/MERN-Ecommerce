const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware.js');
const {
    creatOrder,
    allOrders,
    getOrdersById,
    UpdateOrderStatus,
    createOrderByAdmin,
    updateOrderByAdmin,
} = require('../controllers/cartController');

const router = express.Router();

//all order

router.route('/').post(protect,creatOrder).get(protect,admin,allOrders)

//users orders

router.route('/orders').get(protect,getOrdersById)

// admin create/update order
router.route('/admin').post(protect, admin, createOrderByAdmin);
router.route('/admin/:id').put(protect, admin, updateOrderByAdmin);

// spasafic order

router.route('/:id/status').put(protect,admin,UpdateOrderStatus)


module.exports = router;