import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">YOUR CART</h1>
        <p className="mt-4 font-satoshi text-gray-600">
          Please login to view your cart details.
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

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-12">
        <h1 className="font-integral text-3xl font-bold md:text-5xl">YOUR CART</h1>
        <p className="mt-4 text-center font-satoshi text-gray-600">
          Your cart is empty. Add products to see them here.
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 lg:px-10">
      <h1 className="font-integral text-3xl font-bold md:text-5xl">YOUR CART</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 md:p-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-4 border-b border-gray-200 py-5 last:border-b-0 md:flex-row md:items-center"
            >
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gray-100">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1">
                <h2 className="font-satoshi text-lg font-bold">{item.name}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  ${Number(item.price).toFixed(2)} each
                </p>
                <button
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                  className="mt-3 text-sm font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="h-9 w-9 rounded-full bg-gray-100 text-lg font-bold"
                >
                  -
                </button>
                <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="h-9 w-9 rounded-full bg-gray-100 text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="font-satoshi text-xl font-bold">Order Summary</h3>
          <div className="mt-4 flex items-center justify-between border-b border-gray-200 pb-4 text-gray-700">
            <span>Subtotal</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-full bg-black py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Checkout
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="mt-3 w-full rounded-full border border-gray-300 py-3 text-sm font-semibold"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
