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
  LogOut,
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
          {/* Log Out Button */}
          <li>
            <button
              onClick={handleLogout} // Calls the logout function from useAuth
              className={`w-full flex items-center gap-3 px-6 py-3 text-green-900 rounded-lg hover:bg-red-100 hover:text-red-600 transition ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              {/* Using the LogOut icon from lucide-react for consistency */}
              <LogOut className="size-5" />
              {!isCollapsed && <span>Log Out</span>}
            </button>
          </li>
        </>
      )}

      {role === "VOLUNTEER" && (
        <>
          {navItem("/Dashboard/rides-volunteer", "Rides", Car)}
          {navItem("/Dashboard/accounts", "Accounts", User)}
          <li>
            <button
              onClick={handleLogout} // Calls the logout function from useAuth
              className={`w-full flex items-center gap-3 px-6 py-3 text-green-900 rounded-lg hover:bg-red-100 hover:text-red-600 transition ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              {/* Using the LogOut icon from lucide-react for consistency */}
              <LogOut className="size-5" />
              {!isCollapsed && <span>Log Out</span>}
            </button>
          </li>
        </>
      )}
    </ul>
  );
}
