const mongoose = require('mongoose');

const User = require('./User');
const Product = require('./Product');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    address: {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalcode: { type: Number, required: true },
        country: { type: String, required: true },
    },
    paymentId: { type: String },
    paymentMethod: { type: String, enum: ['card', 'upi', 'cod'], default: 'card' },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
