// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
"use client";
import "app/styles/sideNav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboardEmployee" },
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
    name: "Settings",
    href: "/dashboardEmployee/settings",
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const isActive = (path) => path === pathname;

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={isActive(link.path) ? "active" : "nav-a"}
          >
            <p className="nav-p">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
