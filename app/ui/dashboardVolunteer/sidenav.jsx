import Link from "next/link";
import NavLinks from "@/app/ui/dashboardVolunteer/nav-links";

export default function SideNav() {
  return (
    <div className="h-[95%] w-[98.5%] py-5 bg-white border-b border-gray-300 lg:min-h-[calc(100vh-170px)] lg:border-b-0 lg:border-r">
      <Link href="/"></Link>
      <NavLinks />
    </div>
  );
}
