import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setOrdersError("");
        setOrdersLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setOrders([]);
        setOrdersError("Please login again to view your order history.");
        return;
      }

      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load order history.";
        setOrdersError(message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">MY PROFILE</h1>
        <p className="mt-4 font-satoshi text-gray-600">
          Please login to view your profile details.
        </p>
        <Link
          to="/login"
          className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 lg:px-10">
      <h1 className="font-integral text-3xl font-bold md:text-5xl">MY PROFILE</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
          <p className="font-satoshi text-sm uppercase tracking-[0.2em] text-gray-500">
            Account Information
          </p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-satoshi text-sm text-gray-500">Full Name</p>
              <p className="font-satoshi text-lg font-bold text-black">{user.name}</p>
            </div>
            <div>
              <p className="font-satoshi text-sm text-gray-500">Email Address</p>
              <p className="font-satoshi text-lg font-bold text-black">{user.email}</p>
            </div>
            <div>
              <p className="font-satoshi text-sm text-gray-500">Role</p>
              <p className="inline-block rounded-full bg-gray-100 px-4 py-1 font-satoshi text-sm font-semibold uppercase">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8">
          <h2 className="font-satoshi text-2xl font-bold">Quick Actions</h2>
          <div className="mt-5 space-y-3">
            <Link
              to="/all"
              className="block w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold"
            >
              Continue Shopping
            </Link>
            <Link
              to="/cart"
              className="block w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              className="block w-full rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Go to Checkout
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin-analytics"
                className="block w-full rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                View Analytics (Admin)
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
        <h2 className="font-satoshi text-2xl font-bold">Order History</h2>

        {ordersLoading && (
          <div className="mt-5 flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
            <p className="text-sm text-gray-600">Loading your order history...</p>
          </div>
        )}

        {!ordersLoading && ordersError && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {ordersError}
          </p>
        )}

        {!ordersLoading && !ordersError && orders.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">
            You have not placed any orders yet.
          </p>
        )}

        {!ordersLoading && !ordersError && orders.length > 0 && (
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-satoshi text-sm font-bold text-black">
                    Order #{order._id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-white px-3 py-1 font-semibold">
                    {order.status}
                  </span>
                  <span className="font-semibold">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                  <span className="text-gray-600">
                    {order.items?.length || 0} item(s)
                  </span>
                  <span className="text-gray-600">
                    {String(order.paymentMethod || "card").toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;