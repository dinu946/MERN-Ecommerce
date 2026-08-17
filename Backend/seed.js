const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");

        // Clear old seed data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        // =========================
        // USERS
        // =========================

        const adminPassword = await bcrypt.hash("Admin@123", 10);
        const userPassword = await bcrypt.hash("User@123", 10);

        const users = await User.create([
            {
                name: "Admin User",
                email: "admin@example.com",
                password: adminPassword,
                role: "admin"
            },
            {
                name: "John Doe",
                email: "john@example.com",
                password: userPassword,
                role: "user"
            },
            {
                name: "Sarah Smith",
                email: "sarah@example.com",
                password: userPassword,
                role: "user"
            },
            {
                name: "Mike Johnson",
                email: "mike@example.com",
                password: userPassword,
                role: "user"
            }
        ]);

        console.log("Users created");

        const admin = users[0];
        const john = users[1];
        const sarah = users[2];
        const mike = users[3];

        // =========================
        // PRODUCTS
        // =========================

        const products = await Product.create([
            {
                name: "Classic Black T-Shirt",
                description: "Comfortable cotton black T-shirt.",
                price: 599,
                category: "Clothing",
                stock: 50,
                imageUrl: "https://i.pinimg.com/736x/ba/60/a5/ba60a579408dc7387f04f367f53e8c8d.jpg"
            },
            {
                name: "Blue Denim Jeans",
                description: "Slim-fit blue denim jeans.",
                price: 1299,
                category: "Clothing",
                stock: 30,
                imageUrl: "https://i.pinimg.com/736x/27/cc/5f/27cc5fd9d121b9505419103fbf928d92.jpg"
            },
            {
                name: "Running Shoes",
                description: "Lightweight running shoes.",
                price: 1999,
                category: "Shoes",
                stock: 25,
                imageUrl: "https://i.pinimg.com/1200x/1b/78/a8/1b78a8ea2a5e33540cf4538c37736839.jpg"
            },
            {
                name: "Wireless Headphones",
                description: "Bluetooth wireless headphones.",
                price: 2499,
                category: "Electronics",
                stock: 20,
                imageUrl: "https://i.pinimg.com/736x/26/bf/2a/26bf2aa37a869d39e9b54ce29558fa36.jpg"
            },
            {
                name: "Smart Watch",
                description: "Smart watch with fitness tracking.",
                price: 2999,
                category: "Electronics",
                stock: 15,
                imageUrl: "https://i.pinimg.com/736x/54/59/56/545956e573840ee041e267f99b77f1a0.jpg"
            }
        ]);

        console.log("Products created");

        const tshirt = products[0];
        const jeans = products[1];
        const shoes = products[2];
        const headphones = products[3];
        const watch = products[4];

        // =========================
        // ORDERS
        // =========================

        await Order.create([
            {
                user: john._id,

                items: [
                    {
                        product: tshirt._id,
                        qty: 2,
                        price: tshirt.price
                    },
                    {
                        product: shoes._id,
                        qty: 1,
                        price: shoes.price
                    }
                ],

                totalAmount: (tshirt.price * 2) + shoes.price,

                address: {
                    fullName: "John Doe",
                    street: "123 Main Street",
                    city: "Kolkata",
                    postalcode: 700001,
                    country: "India"
                },

                paymentId: "pay_test_john_001",
                status: "delivered"
            },

            {
                user: sarah._id,

                items: [
                    {
                        product: headphones._id,
                        qty: 1,
                        price: headphones.price
                    }
                ],

                totalAmount: headphones.price,

                address: {
                    fullName: "Sarah Smith",
                    street: "45 Park Street",
                    city: "Kolkata",
                    postalcode: 700016,
                    country: "India"
                },

                paymentId: "pay_test_sarah_001",
                status: "shipped"
            },

            {
                user: mike._id,

                items: [
                    {
                        product: watch._id,
                        qty: 1,
                        price: watch.price
                    },
                    {
                        product: jeans._id,
                        qty: 1,
                        price: jeans.price
                    }
                ],

                totalAmount: watch.price + jeans.price,

                address: {
                    fullName: "Mike Johnson",
                    street: "22 Lake Road",
                    city: "Kolkata",
                    postalcode: 700029,
                    country: "India"
                },

                paymentId: "pay_test_mike_001",
                status: "pending"
            }
        ]);

        console.log("Orders created");

        console.log("\nSeed completed successfully!");
        console.log("\nAdmin login:");
        console.log("Email: admin@example.com");
        console.log("Password: Admin@123");

        console.log("\nUser login:");
        console.log("Email: john@example.com");
        console.log("Password: User@123");

        process.exit(0);

    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedDatabase();