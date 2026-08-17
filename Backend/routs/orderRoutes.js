const express = require("express");

const {
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin gets all orders
router.get(
    "/admin",
    protect,
    admin,
    getAllOrders
);

// Admin updates shipping status
router.put(
    "/admin/:id/status",
    protect,
    admin,
    updateOrderStatus
);

module.exports = router;