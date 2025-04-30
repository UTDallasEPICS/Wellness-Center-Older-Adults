import { useAuth } from "../../providers/Auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import "/app/globalicons.css";

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

  if (isCollapsed) return null;
  if (role === null) {
    return (
      <ul className="py-2">
        <li className="px-4 py-2 text-gray-400">Loading...</li>
      </ul>
    );
  }

  return (
    <ul className="py-2">
      {role === "ADMIN" && (
        <>
          <li>
            <a
              href="/Dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/rides"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Rides
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/volunteers"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Volunteers
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/client"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Clients
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/admin"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Admin
            </a>
          </li>
        </>
      )}

      {role === "VOLUNTEER" && (
        <>
          <li>
            <a
              href="/Dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/rides-volunteer"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Rides
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/hours"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Hours
            </a>
          </li>
          <li>
            <a
              href="/Dashboard/settings"
              className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Settings
            </a>
          </li>
        </>
      )}

      <li>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded hover:bg-red-500 hover:text-white transition mt-2"
        >
          Log Out
        </button>
      </li>
    </ul>
  );
}
