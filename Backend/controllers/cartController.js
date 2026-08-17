const Order = require('../model/Order');
const User = require('../model/User');
const sendEmail = require('../utils/sendEmail');

const allowedOrderStatuses = ['pending', 'shipped', 'delivered'];

const validateOrderPayload = ({ items, totalAmount, address }) => {
    if (!Array.isArray(items) || items.length === 0) {
        return 'Invalid items data';
    }

    if (!address || !address.fullName || !address.street || !address.city || !address.postalcode || !address.country) {
        return 'Invalid address data';
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
        return 'Invalid total amount';
    }

    return null;
};

const buildOrderMessage = ({ customerName, order, totalAmount, items, paymentId, paymentMethod, address }) => {
    return `Hi ${customerName || 'Customer'},

Your order has been created successfully.

Order ID: ${order._id}
Total Amount: ${totalAmount}
Items: ${items.length}
Payment ID: ${paymentId || 'N/A'}
Payment Method: ${(paymentMethod || 'card').toUpperCase()}
Order Status: ${order.status.toUpperCase()}

Shipping Address:
${address.fullName}
${address.street}
${address.city} - ${address.postalcode}
${address.country}

Thank you for shopping with us!`;
};

const creatOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId, paymentMethod } = req.body;
        const validationMessage = validateOrderPayload({ items, totalAmount, address });
        if (validationMessage) {
            return res.status(400).json({ message: validationMessage });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            paymentId,
            paymentMethod,
            address,
        });

        await order.save();

        const orderMessage = buildOrderMessage({
            customerName: req.user.name,
            order,
            totalAmount,
            items,
            paymentId,
            paymentMethod,
            address,
        });

        await sendEmail(req.user.email, orderMessage, 'Order Created Successfully');
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const createOrderByAdmin = async (req, res) => {
    try {
        const { userId, items, totalAmount, address, paymentId, paymentMethod, status } = req.body;
        const validationMessage = validateOrderPayload({ items, totalAmount, address });
        if (validationMessage) {
            return res.status(400).json({ message: validationMessage });
        }

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        if (status && !allowedOrderStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = new Order({
            user: targetUser._id,
            items,
            totalAmount,
            paymentId,
            paymentMethod,
            address,
            status: status || 'pending',
        });

        await order.save();

        const orderMessage = buildOrderMessage({
            customerName: targetUser.name,
            order,
            totalAmount,
            items,
            paymentId,
            paymentMethod,
            address,
        });

        await sendEmail(targetUser.email, orderMessage, 'Order Created Successfully');
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const getOrdersById = async (req, res) => {
    try {
        const order = await Order.find({ user: req.user._id }).populate('items.product', 'price name');
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error showing order', error: error.message });
    }
};

const allOrders = async (req, res) => {
    try {
        const order = await Order.find({}).populate('user', '_id name email');
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

const updateOrderByAdmin = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { items, totalAmount, address, paymentId, paymentMethod, status } = req.body;

        if (items) {
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: 'Invalid items data' });
            }
            order.items = items;
        }

        if (totalAmount !== undefined) {
            if (typeof totalAmount !== 'number' || totalAmount <= 0) {
                return res.status(400).json({ message: 'Invalid total amount' });
            }
            order.totalAmount = totalAmount;
        }

        if (address) {
            const isAddressInvalid = !address.fullName || !address.street || !address.city || !address.postalcode || !address.country;
            if (isAddressInvalid) {
                return res.status(400).json({ message: 'Invalid address data' });
            }
            order.address = address;
        }

        if (paymentId !== undefined) {
            order.paymentId = paymentId;
        }

        if (paymentMethod !== undefined) {
            order.paymentMethod = paymentMethod;
        }

        if (status !== undefined) {
            if (!allowedOrderStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid order status' });
            }
            order.status = status;
        }

        await order.save();
        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

const UpdateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!allowedOrderStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

module.exports = {
    UpdateOrderStatus,
    allOrders,
    getOrdersById,
    creatOrder,
    createOrderByAdmin,
    updateOrderByAdmin,
};