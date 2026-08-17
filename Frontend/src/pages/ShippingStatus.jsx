import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminOrderStatus = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState("");

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Please login again.");
        }

        return {
            Authorization: `Bearer ${token}`,
        };
    };

    // Get all orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/admin`,
                {
                    headers: getAuthHeaders(),
                }
            );

            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status
    const handleStatusChange = async (orderId, status) => {
        try {
            setUpdating(orderId);
            setError("");

            await axios.put(
                `http://localhost:3000/api/orders/admin/${orderId}/status`,
                {
                    status,
                },
                {
                    headers: getAuthHeaders(),
                }
            );

            // Update UI immediately
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status }
                        : order
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to update order status."
            );
        } finally {
            setUpdating("");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="font-satoshi text-xl">
                    Loading orders...
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">

            {/* Header */}
            <div className="mx-auto max-w-7xl">

                <Link
                    to="/admin-analytics"
                    className="inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    ← Back to Analytics
                </Link>

                <div className="mt-8">
                    <h1 className="font-integral text-3xl font-bold md:text-4xl">
                        Order Shipping Status
                    </h1>

                    <p className="mt-2 font-satoshi text-gray-500">
                        Manage and update the shipping status of customer orders.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Orders */}
                <div className="mt-8 space-y-6">

                    {orders.length === 0 ? (
                        <div className="rounded-3xl bg-white p-10 text-center">
                            <p className="font-satoshi text-gray-500">
                                No orders found.
                            </p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order._id}
                                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7"
                            >

                                {/* Order Header */}
                                <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Order ID
                                        </p>

                                        <p className="font-satoshi font-bold">
                                            {order._id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Customer
                                        </p>

                                        <p className="font-satoshi font-bold">
                                            {order.user?.name || "Unknown User"}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.user?.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="font-satoshi text-xl font-bold">
                                            ${order.totalAmount}
                                        </p>
                                    </div>

                                </div>

                                {/* Products */}
                                <div className="mt-6 space-y-5">

                                    {order.items?.map((item) => {

                                        const product = item.product;

                                        return (
                                            <div
                                                key={item._id}
                                                className="flex flex-col gap-5 rounded-2xl bg-gray-50 p-4 md:flex-row"
                                            >

                                                {/* Product Image */}
                                                <div className="h-48 w-full overflow-hidden rounded-2xl bg-gray-200 md:h-40 md:w-40">
                                                    {product?.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex flex-1 flex-col justify-center">

                                                    <h2 className="font-integral text-xl font-bold">
                                                        {product?.name || "Product unavailable"}
                                                    </h2>

                                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                                        {product?.description ||
                                                            "No description available."}
                                                    </p>

                                                    <div className="mt-3 flex gap-5">
                                                        <p className="font-bold">
                                                            Price: ${item.price}
                                                        </p>

                                                        <p className="font-bold">
                                                            Qty: {item.qty}
                                                        </p>
                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>

                                {/* Shipping Status */}
                                <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 md:flex-row md:items-center md:justify-between">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Shipping Status
                                        </p>

                                        <p className="mt-1 font-satoshi font-bold capitalize">
                                            {order.status}
                                        </p>
                                    </div>

                                    <select
                                        value={order.status}
                                        disabled={updating === order._id}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="h-12 rounded-xl border border-gray-300 bg-white px-5 font-satoshi font-semibold outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="shipped">
                                            Shipped
                                        </option>

                                        <option value="delivered">
                                            Delivered
                                        </option>
                                    </select>

                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
};

export default AdminOrderStatus;