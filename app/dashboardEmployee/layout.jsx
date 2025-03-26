"use client";
import { useState, useEffect } from 'react';
import SideNav from "@/app/components/Sidebar/sidenav"; 

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

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full h-[70px] border-b border-gray-300">
        <a href="/dashboardEmployee">
          <p className="p-5 text-lg font-light text-left text-gray-900 w-1/2">WCOA</p>
        </a>
      </div>

      <div className="flex bg-white">
        <SideNav toggleCollapse={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
        <div 
          className={`flex-1 h-[calc(100vh-70px)] transition-all ease-in-out duration-300 ${isCollapsed ? "ml-[70px]" : "ml-0"} md:${isCollapsed ? "ml-[70px]" : "ml-[250px]"}`}
          style={{
            paddingLeft: typeof window !== "undefined" && window.innerWidth > 768 ? (isCollapsed ? '70px' : '250px') : '0',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
