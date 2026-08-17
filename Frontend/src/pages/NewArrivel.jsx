
import TopArrive from '../components/TopArrive'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";

export const NewArrivel = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
     const navigate = useNavigate();
    const Cloths = products.filter((product) => product.category === "Clothing")

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/products`
                );

                setProducts(response.data);
            } catch (error) {
                console.log("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    if (loading) {
        return <PageLoader message="Loading new arrivals..." />;
    }
    return (
        <div className='h-screen '>
            
            <div>
                <h1 className='pt-10 font-integral font-bold text-3xl flex justify-center lg:text-6xl '>NEW ARRIVALS</h1>
            </div>

            <div className="flex overflow-x-auto gap-4">

                {Cloths.map((product) => (
                    <div
                        key={product._id}
                        className="w-[70%] shrink-0 mt-10 p-4 lg:w-[25%] lg:ml-20"
                    >

                        <div onClick={()=>navigate(`/add-to-cart/${product._id}`)} className="h-64 shadow-sm lg:h-90 bg-gray-200 rounded-2xl overflow-hidden">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className="p-2  font-bold">
                            {product.name}
                        </h3>

                        <h2 className="p-2 font-bold">
                            ${product.price}
                        </h2>

                    </div>
                ))}

            </div>

           <div className='lg:flex lg:items-center lg:justify-center'> <button onClick={() => navigate("/all")} className='border-2 border-gray-200 px-38 py-3 m-3 rounded-4xl'>View All</button></div>
            <hr className="w-[95%] mt-20 mx-auto border-t border-gray-300" />

        </div>
    )
}
