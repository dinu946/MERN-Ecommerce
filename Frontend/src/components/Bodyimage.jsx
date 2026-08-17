import React from "react";

import Hero from "../assets/images/Hero.svg";
import Star from "../assets/images/Star.svg";
import Body from "./Body";
import TopArrive from "./TopArrive";
const Bodyimage = () => {
  return (
    <div>
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-80px)]  lg:h-[calc(100vh-116px)] bg-[#F2F0F1]">

      <Body/>

      <div className="w-full h-[50vh] lg:h-full lg:w-[50%] relative overflow-hidden">

        <img
          src={Hero}
          alt="Hero"
          className="ml-5 lg:ml-6 w-full h-full lg:object-cover object-cover object-right scale-110 lg:scale-100 lg:object-right"
        />

        <img
          src={Star}
          alt=""
          className=" absolute top-5 right-4 w-18  lg:top-26 lg:right-30  lg:w-25"
        />

        <img
          src={Star}
          alt=""
          className="absolute top-27 left-10 w-10  lg:top-70 lg:left-8  lg:w-15"
        />

      </div>
      

    </div>
    <TopArrive/>
    </div>
  );
};

export default Bodyimage;