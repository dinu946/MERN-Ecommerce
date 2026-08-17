const Order = require("../model/Order");

// Admin: get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.product", "name description imageUrl price")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get orders",
            error: error.message,
        });
    }
};

// Admin: update order shipping status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({
                message: "Invalid order status",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.status = status;

        const updatedOrder = await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update order status",
            error: error.message,
        });
    }
};

module.exports = {
    getAllOrders,
    updateOrderStatus,
};