import Link from "next/link";
import NavLinks from "@/app/ui/dashboardEmployee/nav-links";
import "/app/styles/sideNav.css";

export default function SideNav() {
  return (
    <div className="navBar">
      <Link href="/dashboardEmployee"></Link>
      <NavLinks />
    </div>
  );
}
