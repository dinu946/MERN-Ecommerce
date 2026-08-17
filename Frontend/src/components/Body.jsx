import React from 'react'
import { useNavigate } from 'react-router-dom'



const Body = () => {
    const navigate = useNavigate()
    return (


        <div className="w-full lg:w-[50%] lg:p-10 pl-5 pt-2">
            <h1 className="font-integral font-bold lg:mt-10 text-4xl  md:text-6xl lg:text-7xl">
                FIND CLOTHES
                <br />
                THAT MATCHES
                <br />
                YOUR STYLE
            </h1>

            <p className="mt-2 text-[13px] lg:mt-6 font-satoshi font-normal text-gray-500">
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater
                to your sense of style.
            </p>

            <button className="mt-2 lg:mt-8 rounded-full bg-black lg:px-10 px-33 py-3  text-white transition hover:bg-gray-800" onClick={()=>navigate("/all")}>
                Shop Now
            </button>

            {/* Statistics */}
            <div className="mt-2 ml-4 lg:mt-10 flex flex-wrap  lg:gap-8">
                <div>
                    <h2 className="text-3xl font-satoshi  font-bold">200+</h2>
                    <p className="text-gray-500 font-integral font-normal text-[14px] lg:text-[17px]">International Brands</p>
                </div>

                <div className='lg:ml-0 ml-15'>
                    <h2 className="text-3xl font-satoshi font-bold">2,000+</h2>
                    <p className="text-gray-500 font-integral font-normal text-[14px] lg:text-[17px]">High-Quality Products</p>
                </div>

                <div className='lg:ml-0 ml-24 mt-2'>
                    <h2 className="text-3xl font-satoshi font-bold">30,000+</h2>
                    <p className="text-gray-500 font-integral font-normal text-[14px] lg:text-[17px]">Happy Customers</p>
                </div>
            </div>
        </div>




    )
}

export default Body