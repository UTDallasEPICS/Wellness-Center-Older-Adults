import Link from "next/link";
import NavLinks from "@/app/ui/dashboardEmployee/nav-links";

export default function SideNav() {
  return (
    <div>
      <Link href="/"></Link>
      <NavLinks />
    </div>
  );
}
