"use client";
import { useState } from "react";

export default function DashHeader() {
  const [display, setDisplay] = useState(false);
  return (
    <div>
      <div className="flex w-full h-full flex-row items-center">
        <div className="ml-12">
          <a href="/Dashboard">
            <p className="text-black text-left text-2xl font-light">WCOA</p>
          </a>
        </div>
        <div className="ml-auto mr-12">
          <input
            type="image"
            className="border border-gray-600 rounded-full p-1 w-10 h-10"
            src="/images/profileImagePlaceHolder.png"
            alt="profile image"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          />
        </div>
      </div>
      <div
        className={`fixed right-[40px] w-[350px] h-[270px] bg-ghostwhite rounded-[15%] ${
          display ? "block" : "hidden"
        }`}
      >
        <div className="m-4 p-4 text-center font-sans">
          <p>Logout</p>
          <button
            type="button"
            className="py-4 px-6"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Change Account
          </button>
          <button
            type="button"
            className="py-4 px-6"
            onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
          >
            Sign Out
          </button>
        </div>
        <button
          type="button"
          className="absolute top-0 right-0 h-11 w-11 rounded-full border-none"
          onClick={() => setDisplay((prevDisplay) => !prevDisplay)}
        >
          <span className="material-symbols-rounded">close</span>
        </button>
      </div>
    </div>
  );
}
