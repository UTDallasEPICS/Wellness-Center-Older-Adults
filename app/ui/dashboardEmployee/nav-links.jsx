"use client";
import { useAuth } from "../../providers/Auth";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import "/app/globalicons.css";

export default function NavLinks() {
  const [activeLink, setActiveLink] = useState(null);
  const pathname = usePathname();
  const { handleLogout } = useAuth();

  const handleClick = (index) => {
    setActiveLink(index);
  };

  const links = [
    { name: "Dashboard", href: "/dashboardEmployee" },
    { name: "Rides", href: "/dashboardEmployee/rides" },
    { name: "Volunteers", href: "/dashboardEmployee/volunteers" },
    { name: "Clients", href: "/dashboardEmployee/clients" },
    { name: "Admin", href: "/dashboardEmployee/admin" },
  ];

  return (
    <>
      {links.map((link, index) => (
        <Link
          key={link.name}
          href={link.href}
          className={`flex items-center text-left p-0 no-underline cursor-pointer focus:outline-none ${
            index === activeLink ? "active" : ""
          }`}
          onClick={() => handleClick(index)}
        >
          <p className="p-4 text-lg font-light no-underline hover:bg-gray-100">
            {link.name}
          </p>
        </Link>
      ))}
      <button
        className="flex items-center text-left p-0 no-underline cursor-pointer focus:outline-none"
        onClick={handleLogout}
      >
        <p className="p-4 text-lg font-light no-underline hover:bg-gray-100">
          Log Out
        </p>
      </button>
    </>
  );
}
