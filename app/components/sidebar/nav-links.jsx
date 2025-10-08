import { useAuth } from "../../providers/Auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Users,
  User,
  Folder,
  Clock,
  Settings,
} from "lucide-react";

export default function NavLinks({ isCollapsed }) {
  const [role, setRole] = useState(null);
  const { handleLogout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/getRole");
        if (!res.ok) throw new Error(res.statusText);
        const { role } = await res.json();
        setRole(role);
      } catch (e) {
        console.error("Could not load role:", e);
      }
    })();
  }, []);

  if (role === null) {
    return (
      <ul className="py-4">
        <li className="px-6 py-2 text-gray-400">Loading...</li>
      </ul>
    );
  }

  const navItem = (href, label, Icon) => (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-6 py-3 text-green-900 rounded-lg hover:bg-green-100 transition ${isCollapsed ? "justify-center" : "gap-3"}`}
      >
        <Icon className="size-5" />
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </li>
  );

  return (
    <ul className="py-4 space-y-1">
      {role === "ADMIN" && (
        <>
          {navItem("/Dashboard", "Dashboard", LayoutDashboard)}
          {navItem("/Dashboard/rides", "Rides", Car)}
          {navItem("/Dashboard/volunteers", "Volunteers", Users)}
          {navItem("/Dashboard/client", "Client", User)}
          {navItem("/Dashboard/admin", "Admin", Folder)}
        </>
      )}

      {role === "VOLUNTEER" && (
        <>
<<<<<<< HEAD
          <li>
            <a
              href="/Dashboard"
              className="block px-4 py-2 rounded hover:bg-[#e2dbd0]/50 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/rides-volunteer"
              className="block px-4 py-2 rounded hover:bg-[#e2dbd0]/50 transition"
            >
              Rides
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/hours"
              className="block px-4 py-2 rounded hover:bg-[#e2dbd0]/50 transition"
            >
              Hours
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/accounts"
              className="block px-4 py-2 rounded hover:bg-[#e2dbd0]/50 transition"
            >
              Accounts
            </a>
          </li>
=======
          {navItem("/Dashboard", "Dashboard", LayoutDashboard)}
          {navItem("/Dashboard/rides-volunteer", "Rides", Car)}
          {navItem("/Dashboard/hours", "Hours", Clock)}
          {navItem("/Dashboard/settings", "Settings", Settings)}
>>>>>>> workingNonChatbot
        </>
      )}

      <li>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-6 py-3 text-red-600 rounded-lg hover:bg-red-50 transition"
        >
        {/*}   Log Out
        // </button>/*}*/}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H6"
            />
          </svg>
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </li>
    </ul>
  );
}
