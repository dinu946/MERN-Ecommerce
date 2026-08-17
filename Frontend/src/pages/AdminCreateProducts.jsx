import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: null,
};

const AdminCreateProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [createForm, setCreateForm] = useState(initialForm);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // ==============================
  // Authentication Headers
  // ==============================

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again to continue.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==============================
  // Handle Input
  // ==============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // Handle Image
  // ==============================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    setCreateForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // ==============================
  // Create Product
  // ==============================

  const handleCreateProduct = async (event) => {
    event.preventDefault();

    setProcessing(true);
    setError("");
    setActionMessage("");

    try {
      if (!createForm.image) {
        setError("Please select a product image.");
        setProcessing(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", createForm.name.trim());
      formData.append(
        "description",
        createForm.description.trim()
      );
      formData.append("price", createForm.price);
      formData.append(
        "category",
        createForm.category.trim()
      );
      formData.append("stock", createForm.stock);

      // IMPORTANT
      // Backend uses upload.single("image")
      formData.append("image", createForm.image);

      const response = await axios.post(
        "http://localhost:3000/api/products",
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product created:", response.data);

      setCreateForm(initialForm);

      setActionMessage(
        "Product created successfully!"
      );

    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ==============================
  // Not Logged In
  // ==============================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">

        <div className="text-center">

          <h1 className="text-3xl font-bold">
            Please Login
          </h1>

          <p className="mt-2 text-gray-500">
            You need to login to access the admin panel.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-black px-8 py-3 font-semibold text-white"
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  // ==============================
  // Not Admin
  // ==============================

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">

        <div className="text-center">

          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

          <p className="mt-2 text-gray-500">
            Only administrators can create products.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-black px-8 py-3 font-semibold text-white"
          >
            Go Home
          </button>

        </div>

      </div>
    );
  }

  // ==============================
  // Admin UI
  // ==============================

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10 md:px-10">

      <div className="mx-auto max-w-3xl">

        {/* ==============================
            Back Button
        ============================== */}

        <Link
          to="/admin-analytics"
          className="mb-6 inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
        >
          ← Back to Analytics
        </Link>

        {/* ==============================
            Page Heading
        ============================== */}

        <div className="mb-8">

          <h1 className="font-integral text-3xl font-bold">
            Create Product
          </h1>

          <p className="mt-2 text-gray-500">
            Add a new product to your store.
          </p>

        </div>

        {/* ==============================
            Error Message
        ============================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==============================
            Success Message
        ============================== */}

        {actionMessage && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {actionMessage}
          </div>
        )}

        {/* ==============================
            Form
        ============================== */}

        <form
          onSubmit={handleCreateProduct}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >

          <div className="space-y-6">

            {/* Product Name */}

            <div>

              <label className="mb-2 block font-semibold">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={createForm.name}
                onChange={handleChange}
                placeholder="One Life Graphic T-shirt"
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-black"
                required
              />

            </div>

            {/* Category */}

            <div>

              <label className="mb-2 block font-semibold">
                Category
              </label>

              <select
                name="category"
                value={createForm.category}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-black"
                required
              >

                <option value="">
                  Select Category
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Accessories">
                  Accessories
                </option>

              </select>

            </div>

            {/* Description */}

            <div>

              <label className="mb-2 block font-semibold">
                Description
              </label>

              <textarea
                name="description"
                value={createForm.description}
                onChange={handleChange}
                placeholder="Product description..."
                className="min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                required
              />

            </div>

            {/* Price + Stock */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-semibold">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  value={createForm.price}
                  onChange={handleChange}
                  placeholder="199"
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                  required
                />

              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={createForm.stock}
                  onChange={handleChange}
                  placeholder="50"
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                  required
                />

              </div>

            </div>

            {/* Image */}

            <div>

              <label className="mb-2 block font-semibold">
                Product Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                required
              />

              {createForm.image && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {createForm.image.name}
                </p>
              )}

            </div>

            {/* Submit Button */}

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? "Creating Product..."
                : "Create Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AdminCreateProducts;