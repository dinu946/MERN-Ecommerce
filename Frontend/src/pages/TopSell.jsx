
import TopArrive from '../components/TopArrive'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
 
export const TopSell = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const electronics = products.filter((products) => products.category === "Electronics")

    useEffect(() => {
        const getProducts = async () => {
            try { 
                const response = await axios.get(
                   "/api/products/"
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
        return <PageLoader message="Loading top selling products..." />;
    }
    return (
        <div className='h-screen '>


            <div>
                <h1 className=' font-integral font-bold text-3xl flex justify-center lg:mt-27  lg:text-6xl'>top selling</h1>
            </div>

            <div className="flex overflow-x-auto gap-4">

                {electronics.map((product) => (
                    <div
                      
                        key={product._id}
                        className="w-[70%] lg:w-[25%] shrink-0 mt-10 p-4 lg:ml-20"
                    >

                        <div className="h-64 shadow-sm lg:h-90 bg-gray-200 rounded-2xl overflow-hidden" onClick={()=>navigate(`/add-to-cart/${product._id}`)}>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className="p-2 font-satoshi font-bold">
                            {product.name}
                        </h3>

                        <h2 className="p-2 font-bold">
                            ${product.price}
                        </h2>

                    </div>
                ))}

            </div>
            <div className='lg:flex lg:justify-center lg:items-center'>
                <button onClick={() => navigate("/all")} className='border-2 border-gray-200 px-38 py-3 m-3 rounded-4xl'>View All</button>
            </div>
            

        </div>
    )
}
