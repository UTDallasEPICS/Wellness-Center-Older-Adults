import Link from "next/link";
import NavLinks from "@/app/ui/dashboardEmployee/nav-links";

export default function SideNav() {
  return (
    <div className="h-[95%] w-[98.5%] p-[20px_0px] bg-white border-b border-gray-300">
      <Link href="/"></Link>
      <NavLinks />
    </div>
  );
}
