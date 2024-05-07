import Link from "next/link";
import NavLinks from "@/app/ui/dashboardVolunteer/nav-links";
import "app/styles/sideNav.css";

export default function SideNav() {
  return (
    <div className="navBar">
      <Link href="/"></Link>
      <NavLinks />
    </div>
  );
}
