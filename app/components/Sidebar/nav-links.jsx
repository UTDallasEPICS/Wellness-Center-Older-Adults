"use client";
import { useAuth } from "../../providers/Auth";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "/app/globalicons.css";

export default function NavLinks({ isCollapsed }) {
  const [activeLink, setActiveLink] = useState(null);
  const [role, setRole] = useState(null);
  const pathname = usePathname();
  const { handleLogout } = useAuth();

  useEffect(() => {
    async function fetchRole() {
      try {
        const response = await fetch("/api/getRole");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched role:", data.role); // Debugging log
          setRole(data.role);
        } else {
          console.error("Failed to fetch role:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    }

    fetchRole();
  }, []);

  const handleClick = (index) => {
    setActiveLink(index);
  };

  // Define links based on the user's role
  let links = [];
  if (role === "ADMIN") {
    links = [
      { name: "Dashboard", href: "/Dashboard" },
      { name: "Rides", href: "/Dashboard/rides" },
      { name: "Volunteers", href: "/Dashboard/volunteers" },
      { name: "Clients", href: "/Dashboard/clients" },
      { name: "Admin", href: "/Dashboard/admin" },
    ];
  } else if (role === "VOLUNTEER") {

    links = [
      { name: "Dashboard", href: "/Dashboard" },
      { name: "Rides", href: "/Dashboard/rides-volunteer" },
      { name: "Hours", href: "/Dashboard/hours" },
      { name: "Settings", href: "/Dashboard/settings" },
    ];
  } else {
    console.log("Role is not set or unrecognized:", role);
  }

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
          <p
            className={`nav-p p-4 text-lg font-light no-underline hover:bg-gray-100 ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            {link.name}
          </p>
        </Link>
      ))}
      <button
        className="flex items-center text-left p-0 no-underline cursor-pointer focus:outline-none"
        onClick={handleLogout}
      >
        <p
          className={`nav-p p-4 text-lg font-light no-underline hover:bg-gray-100 ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          Log Out
        </p>
      </button>
    </>
  );
}



