"use client";

import { useState, useEffect } from 'react';
import SideNav from "@/app/components/sidebar/sidenav";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CREAM_BG = 'bg-[#F4F1F0]'; 

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mainContentPadding, setMainContentPadding] = useState('0');

  const calculateLayoutState = () => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth <= 768;
    
    let padding;
    if (isMobile) {
      padding = '0';
    } else {
      padding = isCollapsed ? '70px' : '250px';
    }

    setMainContentPadding(padding);
  };

  useEffect(() => {
    calculateLayoutState();

    window.addEventListener('resize', calculateLayoutState);

    return () => {
      window.removeEventListener('resize', calculateLayoutState);
    };
  }, [isCollapsed]);

  return (
    <div className={`flex flex-col w-full ${CREAM_BG} min-h-screen`}> 
      <div className={`flex ${CREAM_BG}`}> 
        <SideNav toggleCollapse={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
        <div 
          className={`flex-1 min-h-[100vh] ${CREAM_BG} transition-all ease-in-out duration-300 ${isCollapsed ? "ml-[70px]" : "ml-0"} md:${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
          style={{
            paddingLeft: mainContentPadding,
          }}
        >
          {children}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}