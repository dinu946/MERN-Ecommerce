import React, { createContext, useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const LEGACY_CART_STORAGE_KEY = "cart-items";
const CART_STORAGE_PREFIX = "cart-items";

const getUserCartKey = (user) => {
  if (!user) {
    return null;
  }

  const userIdentifier = user.id || user._id || user.email;
  return userIdentifier ? `${CART_STORAGE_PREFIX}-${userIdentifier}` : null;
};

const parseStoredCart = (storedCart) => {
  if (!storedCart) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      console.error("Invalid cart data in localStorage: expected array");
      return [];
    }

    return parsedCart;
  } catch (error) {
    console.error("Failed to parse cart data from localStorage", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const userCartKey = getUserCartKey(user);
    if (!userCartKey) {
      setCartItems([]);
      return;
    }

    const storedUserCart = localStorage.getItem(userCartKey);
    if (storedUserCart) {
      setCartItems(parseStoredCart(storedUserCart));
      return;
    }

    const legacyCart = localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    if (legacyCart) {
      const parsedLegacyCart = parseStoredCart(legacyCart);
      setCartItems(parsedLegacyCart);
      localStorage.setItem(userCartKey, JSON.stringify(parsedLegacyCart));
      localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
      return;
    }

    setCartItems([]);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const userCartKey = getUserCartKey(user);
    if (!userCartKey) {
      return;
    }

    localStorage.setItem(userCartKey, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = (product) => {
    if (!user) {
      console.error("User must be logged in to add items to cart");
      return false;
    }

    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item._id === product._id);

      if (existingProduct) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          _id: product._id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          description: product.description,
          quantity: 1,
        },
      ];
    });

    return true;
  };

  const removeFromCart = (productId) => {
    if (!user) {
      console.error("User must be logged in to modify cart");
      return;
    }

    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (!user) {
      console.error("User must be logged in to modify cart");
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    if (!user) {
      console.error("User must be logged in to clear cart");
      return;
    }

    setCartItems([]);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
