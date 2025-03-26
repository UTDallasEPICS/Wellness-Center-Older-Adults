
import React from "react";
import NavLinks from "./nav-links"; 

const SideNav = ({ toggleCollapse, isCollapsed}) => {
  return (
    <div className={`fixed top-[70px] h-[calc(100vh-70px)] bg-white transition-all duration-300 ease-in-out z-10 
        ${isCollapsed ? "w-[70px]" : "w-[250px]"} md:w-[250px]"`}>
      <button
        className={`absolute top-0 right-0 flex items-center justify-center h-[70px] w-[70px] bg-white cursor-pointer z-[1001]`}
        onClick={toggleCollapse}
      >
        <div className="flex flex-col justify-around w-[25px] h-[20px]">
          <span className="bg-black h-[2px] w-full"></span>
          <span className="bg-black h-[2px] w-full"></span>
          <span className="bg-black h-[2px] w-full"></span>
        </div>
      </button>
      <NavLinks isCollapsed={isCollapsed} />
    </div>
  );
};

export default SideNav;
