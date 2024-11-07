import SideNav from "@/app/ui/dashboardEmployee/sidenav";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full min-h-screen flex flex-col m-0">
      <div className="w-full h-[70px] border-b border-gray-300">
      <div class="w-20 h-20 rounded-full border-2 border-black flex justify-center items-center">
       <p>404</p>
       </div>
        <a href="/dashboardEmployee">
          <p className="text-gray-900 w-1/2 p-5 text-left font-light text-lg">WCOA</p>
        </a>
      </div>

      <div className="flex h-[calc(100vh-180px)] bg-white overflow-y-scroll">
        <div className="w-2/12 min-h-[calc(100vh-170px)]">
          <SideNav />
        </div>
        <div className="w-10/12 h-[calc(100%-20px)] bg-white">{children}</div>
      </div>
    </div>
  );
}
