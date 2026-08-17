import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import PageLoader from "../components/PageLoader";

const AddToCardPage = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const [Product, setProduct] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)
    const [cartMessage, setCartMessage] = useState("")

    useEffect(() => {
        setAdded(false);
        setCartMessage("");

        const GetProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`)
                setProduct(response.data)

            } catch (error) {
                console.log("Error fetching product:", error);

            } finally {
                setLoading(false)
            }

        }

        GetProduct()
    }, [id])

    if (Loading) {
        return <PageLoader message="Loading product details..." />;
    }
    if (!Product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2>Product not found</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white px-4 py-8 md:px-8 lg:px-16">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-4xl border border-gray-200 bg-gray-50 p-4 shadow-sm md:p-8 lg:flex-row lg:items-center lg:p-10">
                <div className="overflow-hidden rounded-[28px] bg-white  shadow-sm lg:w-[38%]">
                    <img
                        src={Product.imageUrl}
                        alt={Product.name}
                        className="h-105 w-full rounded-[20px] object-cover"
                    />
                </div>

                <div className="flex flex-1 flex-col justify-center gap-5 lg:pl-2">
                    <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                            {Product.category}
                        </p>
                        <h1 className="font-integral text-3xl font-bold text-black md:text-4xl">
                            {Product.name}
                        </h1>
                        <p className="text-3xl font-bold text-black md:text-4xl">${Product.price}</p>
                    </div>

                    <p className="max-w-xl text-sm leading-6 text-gray-600 md:text-base">
                        {Product.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                const didAdd = addToCart(Product);
                                if (didAdd) {
                                    setAdded(true);
                                    setCartMessage("");
                                    return;
                                }

                                setCartMessage("Please login to add items to your cart.");
                            }}
                            className="h-12 rounded-full bg-black px-8 text-sm font-semibold text-white transition hover:bg-gray-800 md:px-10"
                        >
                            {added ? "Added to Cart" : "Add to Cart"}
                        </button>
                    </div>
                    {cartMessage && (
                        <p className="text-sm text-red-600">
                            {cartMessage} <Link to="/login" className="font-semibold underline">Login</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToCardPage;