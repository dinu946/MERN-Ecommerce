import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const initialAddress = {
  fullName: "",
  street: "",
  city: "",
  postalcode: "",
  country: "India",
};

const AdminCreateOrderPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    userId: "",
    productId: "",
    qty: 1,
    paymentMethod: "card",
    paymentId: "",
    status: "pending",
    address: initialAddress,
  });

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === form.productId),
    [products, form.productId]
  );

  const totalAmount = useMemo(() => {
    if (!selectedProduct) {
      return 0;
    }
    return Number(selectedProduct.price) * Number(form.qty || 0);
  }, [selectedProduct, form.qty]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login again to continue.");
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "admin") {
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [usersRes, productsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, { headers: getAuthHeaders() }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
        ]);

        setUsers(usersRes.data);
        setProducts(productsRes.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      if (!selectedProduct) {
        setError("Please select a product.");
        setProcessing(false);
        return;
      }

      const payload = {
        userId: form.userId,
        items: [
          {
            product: selectedProduct._id,
            qty: Number(form.qty),
            price: Number(selectedProduct.price),
          },
        ],
        totalAmount: Number(totalAmount.toFixed(2)),
        paymentMethod: form.paymentMethod,
        paymentId: form.paymentId.trim(),
        status: form.status,
        address: {
          fullName: form.address.fullName.trim(),
          street: form.address.street.trim(),
          city: form.address.city.trim(),
          postalcode: Number(form.address.postalcode),
          country: form.address.country.trim(),
        },
      };

      await axios.post("/api/cart/admin", payload, { headers: getAuthHeaders() });
      setSuccess("Order created successfully.");
      setForm({
        userId: "",
        productId: "",
        qty: 1,
        paymentMethod: "card",
        paymentId: "",
        status: "pending",
        address: initialAddress,
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to create order.");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">CREATE ORDER</h1>
        <p className="mt-4 font-satoshi text-gray-600">Please login to access this page.</p>
        <Link to="/login" className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white">Go to Login</Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">You are not authorized to access this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 lg:px-10">
      <h1 className="font-integral text-3xl font-bold md:text-5xl">CREATE ORDER</h1>
      <p className="mt-3 text-gray-600">Admin can create order with status: pending, shipped, delivered.</p>

      {loading && <p className="mt-6 text-sm text-gray-600">Loading users and products...</p>}
      {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

      {!loading && (
        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-gray-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.userId}
              onChange={(event) => setForm({ ...form, userId: event.target.value })}
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            >
              <option value="">Select User</option>
              {users.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.email})
                </option>
              ))}
            </select>

            <select
              value={form.productId}
              onChange={(event) => setForm({ ...form, productId: event.target.value })}
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (${product.price})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(event) => setForm({ ...form, qty: event.target.value })}
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              placeholder="Quantity"
              required
            />

            <input
              type="text"
              value={totalAmount.toFixed(2)}
              readOnly
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4"
            />

            <select
              value={form.paymentMethod}
              onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            >
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="cod">COD</option>
            </select>

            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <input
            value={form.paymentId}
            onChange={(event) => setForm({ ...form, paymentId: event.target.value })}
            placeholder="Payment ID (optional)"
            className="mt-4 h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
          />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              value={form.address.fullName}
              onChange={(event) => setForm({ ...form, address: { ...form.address, fullName: event.target.value } })}
              placeholder="Full Name"
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            />
            <input
              value={form.address.city}
              onChange={(event) => setForm({ ...form, address: { ...form.address, city: event.target.value } })}
              placeholder="City"
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            />
            <input
              value={form.address.street}
              onChange={(event) => setForm({ ...form, address: { ...form.address, street: event.target.value } })}
              placeholder="Street"
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            />
            <input
              type="number"
              value={form.address.postalcode}
              onChange={(event) => setForm({ ...form, address: { ...form.address, postalcode: event.target.value } })}
              placeholder="Postal Code"
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              required
            />
            <input
              value={form.address.country}
              onChange={(event) => setForm({ ...form, address: { ...form.address, country: event.target.value } })}
              placeholder="Country"
              className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black md:col-span-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {processing ? "Creating..." : "Create Order"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminCreateOrderPage;
