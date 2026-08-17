
const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error.message,
        });
    }
};

const getProductsByid = async (req, res) => {
    try {
        const productById = await Product.findById(req.params.id);
        if (productById) {
            res.json(productById);
        } else {
            res.status(404).json({ message: 'product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message });
    }
};

const createProducts = async (req, res) => {
    try {
        const { name, description, stock, category, price } = req.body;
        let imageUrl = '';

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl,
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'error', error: error.message });
    }
};

const updateProducts = async (req, res) => {
    try {
        const { name, description, stock, category, price } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.stock = stock ?? product.stock;
        product.category = category || product.category;
        product.price = price ?? product.price;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'error', error: error.message });
    }
};

module.exports = {
    createProducts,
    getProducts,
    getProductsByid,
    updateProducts,
    deleteProduct,
};



