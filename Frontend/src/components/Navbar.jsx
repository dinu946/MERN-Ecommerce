import React, { useContext } from "react";
import {
  RiMenuLine,
  RiSearchLine,
  RiShoppingCartLine,
  RiAccountCircleFill,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);

  return (
    <header>
      {user ? (
        <div className="bg-black  py-2 text-center text-sm text-white font-satoshi font-normal">
          Welcome , {user.name}!{" "}
          <button
            type="button"
            onClick={logout}
            className="ml-2 font-bold underline cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-black py-2 text-center text-sm text-white font-satoshi font-normal">
          Sign up and get 20% off to your first order.{" "}
          <span className="font-bold underline cursor-pointer">
            <Link to="/signUp">Sign Up Now</Link>
          </span>
        </div>
      )}

      <nav className="flex items-center justify-between px-4 py-5 md:px-10">
        <RiMenuLine className="text-2xl md:hidden" />

        <Link to="/" className="font-integral text-2xl font-bold md:text-3xl">
          SHOP.CO
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/all">Shop</Link>
          <Link to="/top-selling">Top Selling</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/about-us">About Us</Link>
        </div>

        <div className="hidden items-center rounded-full bg-gray-100 px-4 py-2 md:flex md:w-100">
          <RiSearchLine className="mr-2 text-xl text-gray-500" />
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <RiSearchLine className="cursor-pointer text-2xl md:hidden" />
          <Link to="/cart" className="relative">
            <RiShoppingCartLine className="cursor-pointer text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to={user ? "/profile" : "/login"}>
            <RiAccountCircleFill className="cursor-pointer text-2xl" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;