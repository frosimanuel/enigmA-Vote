"use client";

import React from "react";
import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(https://insidestory.org.au/wp-content/uploads/booth.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content p-8 text-accent-content text-center relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-white bg-opacity-30 rounded-xl"></div>
        <div className="max-w-md text-accent relative z-10">
          <h1 className="mb-5 text-5xl font-bold text-primary">Super Secret Ballot</h1>
          <h2 className="mb-5 text-2xl text-accent">I like my voting as i like my private keys...</h2>
          <b className="mb-5 text-2xl text-accent block"> Just to myself</b>
          <h3 className="text-4xl my-0"></h3>
          <Link href="/join" className="btn btn-lg btn-wide">
            Vote Privately
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
