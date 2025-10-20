"use client";
import { useState, useEffect } from 'react';
import SideNav from "@/app/components/Sidebar/sidenav";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout({ children }) {
  // Default state is collapsed (70px sidebar width)
  const [isCollapsed, setIsCollapsed] = useState(true);
  // 🚀 NEW STATE: Stores the dynamic padding, defaults to 0 to match server render.
  const [mainContentPadding, setMainContentPadding] = useState('0');

  // Function to calculate both collapse state and padding
  const calculateLayoutState = () => {
    if (typeof window === "undefined") return; // Skip on server

    // NOTE: Your handleResize always sets isCollapsed to true. 
    // We assume the logic is to default to collapsed on small screens and use state on large screens.
    
    const isMobile = window.innerWidth <= 768;
    
    // Calculate the padding based on the state
    let padding;
    if (isMobile) {
      // On mobile, padding is always 0 (content goes below/full screen)
      padding = '0';
    } else {
      // On desktop, padding depends on the collapse state
      padding = isCollapsed ? '70px' : '250px';
    }

    // Update the state
    setMainContentPadding(padding);
  };

  useEffect(() => {
    // 1. Run calculation once on mount to synchronize client state
    calculateLayoutState();

    // 2. Add resize listener
    window.addEventListener('resize', calculateLayoutState);

    // 3. Cleanup
    return () => {
      window.removeEventListener('resize', calculateLayoutState);
    };
  }, [isCollapsed]); // Dependency on isCollapsed ensures padding updates when the collapse button is clicked

  return (
    <div className="flex flex-col w-full bg-[#F4F1F0] min-h-screen">
      <div className="flex bg-[#F4F1F0]">
        <SideNav toggleCollapse={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
        <div 
          className={`flex-1 h-[calc(100vh-70px)] bg-[#f4f1f0] transition-all ease-in-out duration-300 ${isCollapsed ? "ml-[70px]" : "ml-0"} md:${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
          style={{
            // 🚀 FIX: Use the state variable for paddingLeft, which defaults to '0' on SSR.
            paddingLeft: mainContentPadding,
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