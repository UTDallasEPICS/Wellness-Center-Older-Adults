import React from "react";
import NavLinks from "./nav-links";
import { Menu } from "lucide-react"; // hamburger icon
import Image from "next/image";

const SideNav = ({ toggleCollapse, isCollapsed }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20
        ${isCollapsed ? "w-[70px]" : "w-[250px]"}`}
    >
      <div className="flex items-center justify-between h-[70px] px-4 border-b border-gray-200">
        <div className="group relative flex items-center">
          <Image
            src="/favicon.ico"
            width={30}
            height={30}
            alt="Site Favicon"
            onClick={toggleCollapse}
            className={`cursor-pointer transition-opacity ${
              isCollapsed
                ? "group-hover:opacity-0 group-hover:pointer-events-none"
                : ""
            }`}
          />
          {isCollapsed && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[30px] w-[30px] flex items-center justify-center text-green-800 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto hover:bg-gray-100 transition"
              onClick={toggleCollapse}
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          )}
          {!isCollapsed && (
            <span className="font-semibold text-lg text-green-800">WCOA</span>
          )}
        </div>
        {!isCollapsed && (
          <button
            className="flex items-center justify-center h-10 w-10 text-green-800 hover:bg-gray-100 rounded-lg transition"
            onClick={toggleCollapse}
          >
            <Menu className="size-6" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <NavLinks isCollapsed={isCollapsed} />

      {/* Footer: Profile
      <div className="absolute bottom-4 w-full flex justify-center">
        <button className="flex items-center justify-center p-3 rounded-full border border-green-800 text-green-800 hover:bg-green-50 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 1 1 15 0H4.5Z"
            />
          </svg>
        </button>
      </div>*/}
    </div>
  );
};

export default SideNav;
