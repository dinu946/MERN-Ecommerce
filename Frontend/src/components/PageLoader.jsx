import React from "react";

const PageLoader = ({ message = "Loading products..." }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      <h2 className="mt-4 font-integral text-2xl font-bold text-black md:text-3xl">
        Please wait
      </h2>
      <p className="mt-2 font-satoshi text-sm text-gray-600 md:text-base">{message}</p>
    </div>
  );
};

export default PageLoader;
