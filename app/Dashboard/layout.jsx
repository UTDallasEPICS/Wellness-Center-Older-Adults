"use client";
import { useState, useEffect } from 'react';
import SideNav from "@/app/components/Sidebar/sidenav";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleResize = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setIsCollapsed(true); 
    } else {
      setIsCollapsed(true); 
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

/*<div className="w-full h-[70px] bg-[#fffdf5] border-b border-gray-300">
        <a href="/Dashboard">
       
        </a>
      </div>*/
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full h-[70px] bg-[#fffdf5] border-b border-gray-300">
        <a href="/Dashboard">
        <Image 
            className="w-60 h-auto mt-2" 
            src="/logo.png" 
            alt="Logo" 
            width={1600} 
            height={800} 
          />    
        </a>
      </div>

      <div className="flex bg-white">
        <SideNav toggleCollapse={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
        <div 
          className={`flex-1 h-[calc(100vh-70px)] bg-[#fffdf5] transition-all ease-in-out duration-300 ${isCollapsed ? "ml-[70px]" : "ml-0"} md:${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
          style={{
            paddingLeft: typeof window !== "undefined" && window.innerWidth > 768 ? (isCollapsed ? '70px' : '250px') : '0',
          }}
        >
          {children}
        </div>
      </div>

      {/* ToastContainer is already placed here */}
      <ToastContainer />
    </div>
  );
}