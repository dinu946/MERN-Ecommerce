import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const initialCreateForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: null,
};

const AdminAnalyticsPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [editProductId, setEditProductId] = useState("");
  const [editForm, setEditForm] = useState(initialCreateForm);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate()
  const selectedProduct = useMemo(
    () => products.find((product) => product._id === editProductId),
    [products, editProductId]
  );

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login again to continue.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAnalytics = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics`, {
      headers: getAuthHeaders(),
    });
    setStats(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
    setProducts(response.data);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "admin") {
        return;
      }

      setLoading(true);
      setError("");
      setActionMessage("");

      try {
        await Promise.all([fetchAnalytics(), fetchProducts()]);
      } catch (requestError) {
        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load analytics data.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");
    setActionMessage("");

    try {
      const formData = new FormData();
      formData.append("name", createForm.name.trim());
      formData.append("description", createForm.description.trim());
      formData.append("price", createForm.price);
      formData.append("category", createForm.category.trim());
      formData.append("stock", createForm.stock);

      if (!createForm.image) {
        setError("Please select a product image.");
        setProcessing(false);
        return;
      }

      formData.append("image", createForm.image);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      setCreateForm(initialCreateForm);
      await Promise.all([fetchAnalytics(), fetchProducts()]);
      setActionMessage("Product created successfully.");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Failed to create product.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const startEditProduct = (product) => {
    setEditProductId(product._id);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      stock: product.stock ?? "",
      image: null,
    });
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    if (!editProductId) {
      setError("Please select a product to update.");
      return;
    }

    setProcessing(true);
    setError("");
    setActionMessage("");

    try {
      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("description", editForm.description.trim());
      formData.append("price", editForm.price);
      formData.append("category", editForm.category.trim());
      formData.append("stock", editForm.stock);
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editProductId}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      await Promise.all([fetchAnalytics(), fetchProducts()]);
      setActionMessage("Product updated successfully.");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Failed to update product.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleProductStatus = async (product) => {
    setProcessing(true);
    setError("");
    setActionMessage("");

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("stock", product.stock > 0 ? 0 : 1);

      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${product._id}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      await Promise.all([fetchAnalytics(), fetchProducts()]);
      setActionMessage(
        product.stock > 0
          ? "Product marked as Out of Stock."
          : "Product marked as In Stock."
      );
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Failed to change product status.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">ADMIN ANALYTICS</h1>
        <p className="mt-4 font-satoshi text-gray-600">
          Please login to access this page.
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

  if (user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">ADMIN ANALYTICS</h1>
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          You are not authorized to view analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 lg:px-10">

      <h1 className="font-integral text-3xl font-bold md:text-5xl">ADMIN ANALYTICS</h1>

      <p className="mt-3 font-satoshi text-gray-600">
        Overview of users, products, orders, and total revenue.
      </p>



      {loading && (
        <div className="mt-6 flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
          <p className="text-sm text-gray-600">Loading analytics...</p>
        </div>
      )}

      {!loading && error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && actionMessage && (
        <p className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {actionMessage}
        </p>
      )}

      {!loading && !error && stats && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="mt-2 font-integral text-3xl">{stats.totalUser}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="mt-2 font-integral text-3xl">{stats.totalProduct}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-2 font-integral text-3xl">{stats.totalOrder}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="mt-2 font-integral text-3xl">
              ${Number(stats.totalrevenue || 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex flex-col lg:flex-row justify-between gap-3 mt-10 lg:mt-20">

        <button className="bg-black rounded-2xl text-white py-5 px-15" onClick={() => navigate('/admin/create-product')}>
          Create Product
        </button>

        <button onClick={()=>navigate("/admin/update-products")} className="bg-black rounded-2xl text-white py-5 px-15">
          Update Product
        </button>

        <button onClick={()=>navigate("/admin/shipping")} className="bg-black rounded-2xl text-white py-5 px-15">
          Product Status
        </button>

        <button onClick={()=>navigate("/admin/delete/products")} className="bg-black rounded-2xl text-white py-5 px-15">
          Delete Product
        </button>



      </div>


    </div>
  );
};

export default AdminAnalyticsPage;
