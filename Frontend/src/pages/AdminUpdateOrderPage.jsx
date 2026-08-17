import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminUpdateOrderPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId),
    [orders, selectedOrderId]
  );

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login again to continue.");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchOrders = async () => {
    const response = await axios.get("/api/cart", { headers: getAuthHeaders() });
    setOrders(response.data);
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (!user || user.role !== "admin") {
        return;
      }

      setLoading(true);
      setError("");
      try {
        await fetchOrders();
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  useEffect(() => {
    if (!selectedOrder) {
      setForm(null);
      return;
    }

    setForm({
      totalAmount: selectedOrder.totalAmount ?? "",
      paymentId: selectedOrder.paymentId || "",
      paymentMethod: selectedOrder.paymentMethod || "card",
      status: selectedOrder.status || "pending",
      address: {
        fullName: selectedOrder.address?.fullName || "",
        street: selectedOrder.address?.street || "",
        city: selectedOrder.address?.city || "",
        postalcode: selectedOrder.address?.postalcode || "",
        country: selectedOrder.address?.country || "",
      },
    });
  }, [selectedOrder]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!selectedOrderId || !form) {
      setError("Please select an order to update.");
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(
        `/api/cart/admin/${selectedOrderId}`,
        {
          totalAmount: Number(form.totalAmount),
          paymentId: form.paymentId.trim(),
          paymentMethod: form.paymentMethod,
          status: form.status,
          address: {
            fullName: form.address.fullName.trim(),
            street: form.address.street.trim(),
            city: form.address.city.trim(),
            postalcode: Number(form.address.postalcode),
            country: form.address.country.trim(),
          },
        },
        { headers: getAuthHeaders() }
      );

      await fetchOrders();
      setSuccess("Order updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Failed to update order.");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">UPDATE ORDER</h1>
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
      <h1 className="font-integral text-3xl font-bold md:text-5xl">UPDATE ORDER</h1>

      {loading && <p className="mt-6 text-sm text-gray-600">Loading orders...</p>}
      {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

      {!loading && (
        <form onSubmit={handleUpdate} className="mt-8 rounded-3xl border border-gray-200 bg-white p-6">
          <select
            value={selectedOrderId}
            onChange={(event) => setSelectedOrderId(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
            required
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order._id} - {order.user?.name || "User"} - ${Number(order.totalAmount).toFixed(2)}
              </option>
            ))}
          </select>

          {form && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                type="number"
                min="1"
                value={form.totalAmount}
                onChange={(event) => setForm({ ...form, totalAmount: event.target.value })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="Total Amount"
                required
              />
              <input
                value={form.paymentId}
                onChange={(event) => setForm({ ...form, paymentId: event.target.value })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="Payment ID"
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
              <input
                value={form.address.fullName}
                onChange={(event) => setForm({ ...form, address: { ...form.address, fullName: event.target.value } })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="Full Name"
                required
              />
              <input
                value={form.address.city}
                onChange={(event) => setForm({ ...form, address: { ...form.address, city: event.target.value } })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="City"
                required
              />
              <input
                value={form.address.street}
                onChange={(event) => setForm({ ...form, address: { ...form.address, street: event.target.value } })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="Street"
                required
              />
              <input
                type="number"
                value={form.address.postalcode}
                onChange={(event) => setForm({ ...form, address: { ...form.address, postalcode: event.target.value } })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="Postal Code"
                required
              />
              <input
                value={form.address.country}
                onChange={(event) => setForm({ ...form, address: { ...form.address, country: event.target.value } })}
                className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-black md:col-span-2"
                placeholder="Country"
                required
              />
            </div>
          )}

          {form && (
            <button
              type="submit"
              disabled={processing}
              className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {processing ? "Updating..." : "Update Order"}
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default AdminUpdateOrderPage;
