import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const TEST_CARD_PAYMENT = {
  cardNumber: "4111111111111111",
  expiry: "12/28",
  cvv: "123",
  cardName: "TEST USER",
};

const TEST_UPI_PAYMENT = {
  upiId: "testuser@upi",
};

const initialAddress = {
  fullName: "",
  street: "",
  city: "",
  postalcode: "",
  country: "India",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payment, setPayment] = useState({
    ...TEST_CARD_PAYMENT,
    ...TEST_UPI_PAYMENT,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please login first to place your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (paymentMethod === "card") {
      if (
        payment.cardNumber !== TEST_CARD_PAYMENT.cardNumber ||
        payment.expiry !== TEST_CARD_PAYMENT.expiry ||
        payment.cvv !== TEST_CARD_PAYMENT.cvv ||
        payment.cardName.toUpperCase() !== TEST_CARD_PAYMENT.cardName
      ) {
        setError("Use the exact test card credentials shown below.");
        return;
      }
    }

    if (paymentMethod === "upi") {
      if (payment.upiId.toLowerCase() !== TEST_UPI_PAYMENT.upiId) {
        setError("Use the exact test UPI ID shown below.");
        return;
      }
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Login token missing. Please login again.");
        setProcessing(false);
        return;
      }

      const fakePaymentId =
        paymentMethod === "card"
          ? `TESTPAY-CARD-${Date.now()}`
          : paymentMethod === "upi"
            ? `TESTPAY-UPI-${Date.now()}`
            : `TESTPAY-COD-${Date.now()}`;

      const payload = {
        items: cartItems.map((item) => ({
          product: item._id,
          qty: item.quantity,
          price: Number(item.price),
        })),
        totalAmount: Number(totalPrice.toFixed(2)),
        paymentId: fakePaymentId,
        paymentMethod,
        address: {
          fullName: address.fullName.trim(),
          street: address.street.trim(),
          city: address.city.trim(),
          postalcode: Number(address.postalcode),
          country: address.country.trim(),
        },
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPaymentId(fakePaymentId);
      setSuccess("Payment successful! Your order is placed.");
      clearCart();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Checkout failed. Please try again.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-12">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">CHECKOUT</h1>
        <p className="mt-4 text-center font-satoshi text-gray-600">
          Add products to your cart before checkout.
        </p>
        <Link
          to="/all"
          className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">ORDER CONFIRMED</h1>
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Test Payment ID: <span className="font-semibold">{paymentId}</span>
        </p>
        <button
          type="button"
          onClick={() => navigate("/all")}
          className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Shop More
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 lg:px-10">
      <h1 className="font-integral text-3xl font-bold md:text-5xl">CHECKOUT</h1>

      {!user && (
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Please <Link to="/login" className="font-semibold underline">login</Link> before placing an order.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6"
        >
          <h2 className="font-satoshi text-xl font-bold">Shipping Address</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              placeholder="Full Name"
              required
            />
            <input
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              placeholder="City"
              required
            />
            <input
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black md:col-span-2"
              placeholder="Street Address"
              required
            />
            <input
              type="number"
              value={address.postalcode}
              onChange={(e) => setAddress({ ...address, postalcode: e.target.value })}
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              placeholder="Postal Code"
              required
            />
            <input
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
              placeholder="Country"
              required
            />
          </div>

          <h2 className="mt-8 font-satoshi text-xl font-bold">Payment Method</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`h-11 rounded-xl border text-sm font-semibold ${paymentMethod === "card"
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white text-black"
                }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              className={`h-11 rounded-xl border text-sm font-semibold ${paymentMethod === "upi"
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white text-black"
                }`}
            >
              UPI
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`h-11 rounded-xl border text-sm font-semibold ${paymentMethod === "cod"
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white text-black"
                }`}
            >
              COD
            </button>
          </div>

          <h2 className="mt-8 font-satoshi text-xl font-bold">Test Payment</h2>
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold">Use these fake credentials for testing:</p>
            {paymentMethod === "card" && (
              <>
                <p className="mt-2">Card Number: {TEST_CARD_PAYMENT.cardNumber}</p>
                <p>Expiry: {TEST_CARD_PAYMENT.expiry}</p>
                <p>CVV: {TEST_CARD_PAYMENT.cvv}</p>
                <p>Name: {TEST_CARD_PAYMENT.cardName}</p>
              </>
            )}
            {paymentMethod === "upi" && (
              <p className="mt-2">UPI ID: {TEST_UPI_PAYMENT.upiId}</p>
            )}
            {paymentMethod === "cod" && (
              <p className="mt-2">No payment credentials needed. Pay on delivery.</p>
            )}
          </div>

          {paymentMethod === "card" && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black md:col-span-2"
                placeholder="Card Number"
                required
              />
              <input
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="MM/YY"
                required
              />
              <input
                value={payment.cvv}
                onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="CVV"
                required
              />
              <input
                value={payment.cardName}
                onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                className="h-12 rounded-xl border border-gray-300 px-4 outline-none focus:border-black md:col-span-2"
                placeholder="Cardholder Name"
                required
              />
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="mt-4">
              <input
                value={payment.upiId}
                onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-black"
                placeholder="UPI ID"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? "Processing..." : "Pay & Place Order"}
          </button>
        </form>

        <div className="h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="font-satoshi text-xl font-bold">Order Summary</h3>
          <p className="mt-2 text-sm text-gray-600">{totalItems} item(s)</p>
          <p className="mt-1 text-sm text-gray-600">
            Payment: <span className="font-semibold uppercase">{paymentMethod}</span>
          </p>
          <div className="mt-4 space-y-3 border-b border-gray-200 pb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-sm">
                <span className="max-w-[75%] truncate">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
