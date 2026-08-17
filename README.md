# 🛍️ MERN E-Commerce Website

A modern, full-stack e-commerce website built using the **MERN stack**. This project provides a complete online shopping experience with user authentication, product management, shopping cart, order management, and online payment integration.

## 🚀 Features

* 🔐 User registration and login
* 👤 User authentication
* 🛍️ Browse products
* 🛒 Add and remove products from cart
* 📦 Place and manage orders
* 💳 Razorpay payment integration
* 👨‍💼 Admin product management
* 🗑️ Delete products
* 📱 Responsive design
* 🔄 RESTful API
* 🗄️ MongoDB database integration

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Vite
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Payment

* Razorpay

## 📂 Project Structure

```text
MERN-Ecommerce/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd MERN-Ecommerce
```

### 2. Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `Backend` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ Never upload your `.env` file or private API keys to GitHub.

### 4. Start the backend

```bash
cd Backend
npm run dev
```

### 5. Start the frontend

Open another terminal:

```bash
cd Frontend
npm run dev
```

The application will be available at the local Vite URL shown in your terminal.



```text
Homepage
Product Page
Shopping Cart
Checkout
Admin Dashboard
```

## 🔑 Main Functionality

### User

* Register and login
* Browse products
* Add products to cart
* Update cart
* Place orders
* Make payments
* View orders

### Admin

* Add products
* View products
* Delete products
* Manage inventory

## 💳 Payment Integration

The project uses **Razorpay** for online payment processing.

Payment credentials are stored securely using environment variables and are not included in the repository.

## 🔮 Future Improvements

* Product search and filtering
* Product reviews and ratings
* Wishlist
* Advanced admin dashboard
* Order status updates
* Email notifications
* Image upload optimization
* Deployment and CI/CD

## 🌐 Live Demo[ https://mern-ecommerce-1-v4b1.onrender.com ]



## 👨‍💻 Author

**Dibyendu Bagchi**

This project was built as a portfolio project to demonstrate full-stack web development skills using the MERN stack.

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
