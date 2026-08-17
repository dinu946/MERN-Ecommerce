import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
export const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Loading
  if (loading) {
    return <PageLoader message="Loading all products..." />;
  }

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-bold text-red-500">
          {error}
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Top Border */}
      <hr className="w-[95%] mx-auto border-t border-gray-300" />

      {/* Page Title */}
      <div>
        <h1 className="pt-10 pb-5 font-integral font-normal text-2xl flex justify-center lg:text-4xl">
          ALL PRODUCTS
        </h1>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-4 lg:gap-6 lg:px-10">

        {products.map((product) => (
          <div
            key={product._id}
            className="mt-5 p-2 lg:p-4"
          >

            {/* Product Image */}
            <div onClick={() => navigate(`/add-to-cart/${product._id}`)} className="h-50 shadow-sm  lg:h-90 bg-gray-200 rounded-2xl overflow-hidden">

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />

            </div>

            {/* Product Name */}
            <h3 className="p-2 font-satoshi font-bold text-sm lg:text-base">
              {product.name}
            </h3>

            {/* Product Price */}
            <h2 className="px-2 font-bold text-lg">
              ${product.price}
            </h2>

          </div>
        ))}

      </div>

    </div>
  );
};