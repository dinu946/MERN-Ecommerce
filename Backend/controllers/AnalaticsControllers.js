const User = require('../model/User');
const Order = require('../model/Order');
const Product = require('../model/Product');

const getAdminState = async (req, res) => {
    try {
        const totalUser = await User.countDocuments({});
        const totalOrder = await Order.countDocuments({});
        const totalProduct = await Product.countDocuments({});

        const Orders = await Order.find({});
        const totalrevenue = Orders.reduce(
            (acc, order) => acc + order.totalAmount,
            0
        );

        res.json(
            {
                totalOrder,
                totalProduct,
                totalUser,
                totalrevenue,
            }
        )
    } catch (error) {
        res.status(500).json({ message: "error ", error })
    }
}
module.exports = {getAdminState}
