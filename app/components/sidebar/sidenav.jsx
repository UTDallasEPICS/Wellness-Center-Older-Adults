import React from "react";
import NavLinks from "./nav-links";

const SideNav = ({ toggleCollapse, isCollapsed }) => {
  return (
    <div
      className={`fixed top-[70px] h-[calc(100vh-70px)] bg-[#fffdf5] border-r border-[#e2dbd0] transition-all duration-300 ease-in-out z-10
        ${isCollapsed ? "w-[70px]" : "w-[250px]"} md:w-[250px]"`}
    >
      <button
        className={`absolute top-0 right-0 flex items-center justify-center h-[70px] w-[70px] bg-[#fffdf5] cursor-pointer z-[1001]`}
        onClick={toggleCollapse}
      >
        {/* <div className="flex flex-col justify-around w-[25px] h-[20px]"> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        {/* </div> */}
      </button>
      <NavLinks isCollapsed={isCollapsed} />
    </div>
  );
};

export default SideNav;
