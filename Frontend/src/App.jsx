import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { NewArrivel } from "./pages/NewArrivel";
import { TopSell } from "./pages/TopSell";
import { AllProduct } from "./pages/AllProduct";
import SignUp from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import AddToCardPage from "./pages/AddToCardPage";
import ProfilePage from './pages/ProfilePage';
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutUsPage from "./pages/AboutUsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminCreateProducts from "./pages/AdminCreateProducts";
import AdminUpdateProduct from "./pages/AdminUpdateProduct";
import ShippingStatus from "./pages/ShippingStatus";
import AdminDeleteProducts from "./pages/DeleteProducts";
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const Layout = () => {
  const location = useLocation();

  // Pages where Navbar should NOT be visible
  const hideNavbar = ["/signUp", "/login", "/verify-otp"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />

      {!hideNavbar && <Navbar />}

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <NewArrivel />
              <TopSell />
            </>
          }
        />

        {/* All Products */}
        <Route
          path="/all"
          element={<AllProduct />}
        />

        {/* Top Selling */}
        <Route
          path="/top-selling"
          element={<TopSell />}
        />

        {/* New Arrivals */}
        <Route
          path="/new-arrivals"
          element={<NewArrivel />}
        />

        {/* sign Up */}
        <Route
          path="/signUp"
          element={<SignUp />}
        />
        {/* Login  */}
        <Route
          path="/login"
          element={<LoginPage />}
        />
        {/* OTP Verification */}
        <Route
          path="/verify-otp"
          element={<OtpVerificationPage />}
        />
        <Route path="/add-to-cart/:id"
          element={<AddToCardPage />} />

        <Route path="/profile"
          element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/admin-analytics" element={<AdminAnalyticsPage />} />
        <Route
          path="/admin/create-product"
          element={<AdminCreateProducts />}
        />
        <Route path="admin/update-products"
          element={<AdminUpdateProduct />} />

        <Route path="admin/shipping" element={<ShippingStatus />} />
        <Route path="admin/delete/products" element={<AdminDeleteProducts />} />
      </Routes>


    </>
  );
};


const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;