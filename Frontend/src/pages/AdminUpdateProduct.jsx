import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminUpdateProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // AUTH
  // =========================

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // GET PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );

      setProducts(response.data);
    } catch (error) {
      console.error(error);

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

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEdit = (product) => {
    setSelectedProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
      image: null,
    });

    // Show current image
    setImagePreview(product.imageUrl);

    setError("");
    setSuccess("");

    setTimeout(() => {
      document
        .getElementById("edit-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setForm({
      ...form,
      image: file,
    });

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append("price", form.price);
      formData.append(
        "category",
        form.category.trim()
      );
      formData.append("stock", form.stock);

      // IMPORTANT:
      // Send new image only if admin selected one
      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${selectedProduct._id}`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated product:", response.data);

      setSuccess("Product updated successfully!");

      // Refresh products
      await fetchProducts();

      // Update selected product with new data
      setSelectedProduct(response.data);

      setForm({
        name: response.data.name || "",
        description: response.data.description || "",
        price: response.data.price || "",
        category: response.data.category || "",
        stock: response.data.stock || "",
        image: null,
      });

      // Show updated Cloudinary image
      setImagePreview(response.data.imageUrl);

    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product."
      );
    } finally {
      setProcessing(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="font-satoshi text-lg">
          Loading products...
        </h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-16">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="font-integral text-3xl font-bold">
              Update Products
            </h1>

            <p className="mt-2 text-gray-500">
              Manage and edit your store products.
            </p>
          </div>

          <Link
            to="/admin-analytics"
            className="w-fit rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            ← Back to Analytics
          </Link>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* ========================= */}
        {/* PRODUCT LIST */}
        {/* ========================= */}

        <div className="mt-10">

          <h2 className="font-satoshi text-2xl font-bold">
            All Products
          </h2>

          <div className="mt-5 space-y-4">

            {products.map((product) => (

              <div
                key={product._id}
                className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md md:flex-row md:items-center"
              >

                {/* IMAGE */}

                <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 md:h-28 md:w-28">

                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                </div>

                {/* PRODUCT INFO */}

                <div className="flex-1">

                  <h3 className="font-satoshi text-lg font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {product.category}
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    ₹{product.price}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>

                </div>

                {/* EDIT */}

                <button
                  onClick={() =>
                    handleEdit(product)
                  }
                  className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Edit Product
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* ========================= */}
        {/* EDIT FORM */}
        {/* ========================= */}

        {selectedProduct && (

          <div
            id="edit-form"
            className="mt-12 rounded-3xl border border-gray-200 bg-white p-6 md:p-8"
          >

            {/* EDIT HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-satoshi text-2xl font-bold">
                  Edit Product
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update product details and image.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setImagePreview("");
                }}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100"
              >
                Cancel
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="mt-6 space-y-5"
            >

              {/* ========================= */}
              {/* IMAGE */}
              {/* ========================= */}

              <div>

                <label className="mb-2 block font-semibold">
                  Product Image
                </label>

                <div className="flex flex-col gap-5 md:flex-row md:items-center">

                  {/* IMAGE PREVIEW */}

                  <div className="h-48 w-48 overflow-hidden rounded-2xl bg-gray-100">

                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* IMAGE INPUT */}

                  <div className="flex-1">

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Select a new image if you want to
                      replace the current product image.
                    </p>

                  </div>

                </div>

              </div>

              {/* ========================= */}
              {/* NAME */}
              {/* ========================= */}

              <div>

                <label className="mb-2 block font-semibold">
                  Product Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                  required
                />

              </div>

              {/* ========================= */}
              {/* CATEGORY */}
              {/* ========================= */}

              <div>

                <label className="mb-2 block font-semibold">
                  Category
                </label>

                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                  required
                />

              </div>

              {/* ========================= */}
              {/* DESCRIPTION */}
              {/* ========================= */}

              <div>

                <label className="mb-2 block font-semibold">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  className="min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  required
                />

              </div>

              {/* ========================= */}
              {/* PRICE + STOCK */}
              {/* ========================= */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block font-semibold">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: event.target.value,
                      })
                    }
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
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        stock: event.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                    required
                  />

                </div>

              </div>

              {/* ========================= */}
              {/* UPDATE BUTTON */}
              {/* ========================= */}

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Updating Product..."
                  : "Update Product"}
              </button>

            </form>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminUpdateProducts;