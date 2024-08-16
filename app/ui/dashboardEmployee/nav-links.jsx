"use client";
import "app/styles/sideNav.css";
import { useAuth } from "../../providers/Auth";
import "app/globalicons.css";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";




export default function NavLinks() {
  const [activeLink, setActiveLink] = useState(null);
  const pathname = usePathname();

  const handleClick = (index) => {
    setActiveLink(index);
  };
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();
const links = [
  { name: "Dashboard", href: "/dashboardEmployee" }, // Using icon name from Material Symbols Rounded font

  {
    name: "Rides",
    href: "/dashboardEmployee/rides",
  },
  {
    name: "Volunteers",
    href: "/dashboardEmployee/volunteers",
  },
  {
    name: "Clients",
    href: "/dashboardEmployee/clients",
  },
  {
    name: "Admin",
    href: "/dashboardEmployee/admin",
  },
  {
      name: "Log Out",
      href: "/logout",
      onClick: handleLogout,
  },
];
  return (
    <>
      {links.map((link, index) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={index === activeLink ? "nav-a active" : "nav-a"}
            onClick={() => handleClick(index)}
          >
            <p className="nav-p">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
