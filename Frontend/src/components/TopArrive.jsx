import React from 'react'
import Zara from "../assets/images/Zara.svg";
import Gucci from "../assets/images/Gucci.svg";
import Calvin from "../assets/images/Calvin.svg";
import Prada from "../assets/images/Prada.svg";
import Versace from "../assets/images/Versace.svg";



const TopArrive = () => {
    return (
        
            <div className='min-h-30 bg-black w-full grid grid-cols-3 gap-4 place-items-center py-6 lg:flex lg:items-center lg:justify-around'>
                <img src={Versace} alt="" className='scale-75 lg:scale-100' />
                <img src={Zara} alt="" className='scale-65 lg:scale-100' />
                <img src={Gucci} alt="" className='scale-75 lg:scale-100' />
                <img src={Prada} alt="" className='scale-85 lg:scale-100 ml-30 lg:ml-0' />
                <img src={Calvin} alt="" className='scale-100 lg:scale-100 ml-40 lg:ml-0' />
            </div>
       
    )
}

export default TopArrive