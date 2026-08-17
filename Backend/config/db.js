const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URL) {
        console.warn('MONGO_URL is not set. Database connection skipped.');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;