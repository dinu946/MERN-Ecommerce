import React from "react";

const AboutUsPage = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 lg:px-10">
      <div className="rounded-4xl border border-gray-200 bg-gray-50 p-6 md:p-10">
        <p className="font-satoshi text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          About SHOP.CO
        </p>
        <h1 className="mt-3 font-integral text-3xl font-bold text-black md:text-5xl">
          We Make Everyday Style Simple
        </h1>
        <p className="mt-5 max-w-3xl font-satoshi text-base leading-7 text-gray-700">
          SHOP.CO is an online store built to deliver quality fashion and electronics at fair prices.
          We focus on clean design, easy shopping, and products that people actually love to use.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h2 className="font-satoshi text-xl font-bold">Our Mission</h2>
          <p className="mt-3 font-satoshi text-sm leading-6 text-gray-600">
            To make premium products accessible through a smooth and trusted shopping experience.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h2 className="font-satoshi text-xl font-bold">Our Vision</h2>
          <p className="mt-3 font-satoshi text-sm leading-6 text-gray-600">
            To become the first choice for modern shoppers looking for style, value, and reliability.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h2 className="font-satoshi text-xl font-bold">Why Choose Us</h2>
          <p className="mt-3 font-satoshi text-sm leading-6 text-gray-600">
            Curated collections, secure checkout, and fast support — all in one place.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
        <h3 className="font-satoshi text-2xl font-bold">Contact</h3>
        <p className="mt-3 font-satoshi text-sm text-gray-600">
          Email: support@shopco.com
        </p>
        <p className="mt-1 font-satoshi text-sm text-gray-600">
          Phone: +91 90000 00000
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
