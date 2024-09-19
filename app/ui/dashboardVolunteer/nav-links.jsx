"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboardVolunteer" },
  { name: "Rides", href: "/dashboardVolunteer/rides" },
  { name: "Hours", href: "/dashboardVolunteer/hours" },
  { name: "Settings", href: "/dashboardVolunteer/settings" },
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
            className={`flex items-center no-underline cursor-pointer ${
              index === activeLink ? "border-b-3 border-black" : ""
            }`}
            onClick={() => handleClick(index)}
          >
            <p
              className={`p-4 text-lg font-light hover:bg-gray-100 ${
                index === activeLink ? "text-black" : "text-gray-500"
              }`}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
