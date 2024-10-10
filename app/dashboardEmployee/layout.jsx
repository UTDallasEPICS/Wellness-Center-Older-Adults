"use client";
import { useState } from 'react';
import SideNav from "@/app/ui/dashboardEmployee/sidenav"; 

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="w-full min-h-screen flex flex-col m-0">
      <div className="w-full h-[70px] border-b border-gray-300">
        <a href="/dashboardEmployee">
          <p className="text-gray-900 w-1/2 p-5 text-left font-light text-lg">WCOA</p>
        </a>
      </div>

      <div className="flex h-[calc(100vh-180px)] bg-white overflow-y-scroll">
        <div className={` ${isCollapsed ? 'w-1/12' : 'w-2/12'} min-h-[calc(100vh-170px)]`}>
          <SideNav toggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
        </div>
        <div className={`${isCollapsed ? 'w-11/12' : 'w-10/12'} h-[calc(100%-20px)] bg-white`}>
          {children}
        </div>
      </div>
    </div>
  );
}


