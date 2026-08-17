import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDeleteProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Please login again.");
        }

        return {
            Authorization: `Bearer ${token}`,
        };
    };

    // Get all products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:3000/api/products"
            );

            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Delete product
    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeleting(productId);
            setError("");
            setSuccess("");

            await axios.delete(
                `http://localhost:3000/api/products/${productId}`,
                {
                    headers: getAuthHeaders(),
                }
            );

            // Remove product from UI
            setProducts((prevProducts) =>
                prevProducts.filter(
                    (product) => product._id !== productId
                )
            );

            setSuccess("Product deleted successfully.");
        } catch (error) {
            console.error("Delete product error:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to delete product."
            );
        } finally {
            setDeleting("");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="font-satoshi text-xl">
                    Loading products...
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">

            <div className="mx-auto max-w-7xl">

                {/* Back Button */}
                <Link
                    to="/admin-analytics"
                    className="inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    ← Back to Analytics
                </Link>

                {/* Heading */}
                <div className="mt-8">
                    <h1 className="font-integral text-3xl font-bold md:text-4xl">
                        Delete Products
                    </h1>

                    <p className="mt-2 font-satoshi text-gray-500">
                        Manage and remove products from your store.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-600">
                        {success}
                    </div>
                )}

                {/* Products */}
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {products.length === 0 ? (
                        <div className="col-span-full rounded-3xl bg-white p-10 text-center">
                            <p className="font-satoshi text-gray-500">
                                No products found.
                            </p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product._id}
                                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                            >

                                {/* Product Image */}
                                <div className="h-72 w-full overflow-hidden bg-gray-100">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-5">

                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                        {product.category}
                                    </p>

                                    <h2 className="mt-2 font-integral text-xl font-bold">
                                        {product.name}
                                    </h2>

                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                                        {product.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">

                                        <p className="font-satoshi text-xl font-bold">
                                            ${product.price}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Stock: {product.stock}
                                        </p>

                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() =>
                                            handleDelete(product._id)
                                        }
                                        disabled={
                                            deleting === product._id
                                        }
                                        className="mt-5 h-12 w-full rounded-xl bg-red-600 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {deleting === product._id
                                            ? "Deleting..."
                                            : "Delete Product"}
                                    </button>

                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
};

export default AdminDeleteProducts;