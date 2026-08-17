const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { clearExpiredOtps } = require('./controllers/authController');
const orderRoutes = require("./routs/orderRoutes");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => { res.send('API is running...'); });
app.use('/api/auth', require('./routs/authRoutes'));
app.use('/api/products', require('./routs/productsRouts'));
app.use('/api/cart', require('./routs/cartRouts'));
app.use('/api/payment', require('./routs/paymentRouts'));
app.use('/api/analatics', require('./routs/analaticsRouts'));
app.use('/api/analytics', require('./routs/analaticsRouts'));
app.use("/api/orders", orderRoutes);
if (process.env.MONGO_URL) {
  connectDB();

  setInterval(async () => {
    try {
      await clearExpiredOtps();
    } catch (error) {
      console.error('Error clearing expired OTP data:', error);
    }
  }, 60 * 1000);
} else {
  console.warn('MONGO_URL is not set. Skipping database connection.');
}

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
