"use client";
import "/app/styles/sideNav.css";
import "/app/globalicons.css";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboardVolunteer" }, // Using icon name from Material Symbols Rounded font

  {
    name: "Rides",
    href: "/dashboardVolunteer/rides",
  },
  {
    name: "Hours",
    href: "/dashboardVolunteer/hours",
  },

  {
    name: "Settings",
    href: "/dashboardVolunteer/settings",
  },
];

export default function NavLinks() {
  const [activeLink, setActiveLink] = useState(null);
  const pathname = usePathname();

  const handleClick = (index) => {
    setActiveLink(index);
  };

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
