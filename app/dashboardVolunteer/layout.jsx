import SideNav from "@/app/ui/dashboardVolunteer/sidenav";
import DashHeader from "@/app/components/DashHeader.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="w-full h-[70px] border-b border-gray-300">
        <DashHeader />
      </div>

      <div className="flex h-[calc(100vh-180px)] bg-white">
        <div className="w-2/12 min-h-[calc(100vh-170px)]">
          <SideNav />
        </div>
        <div className="w-10/12 h-[calc(100%-20px)] bg-[#eceeefd6]">{children}</div>
      </div>

      <div className="w-[calc(100%-80px)] h-[70px] mt-auto mb-0">
        <p className="w-full h-[60px] bg-white border-t border-gray-300 text-gray-900 font-light text-lg p-2.5">
          Wellness Center Coordination App 2024
        </p>
      </div>
    </div>
  );
}
