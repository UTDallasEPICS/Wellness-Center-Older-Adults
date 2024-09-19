import SideNav from "@/app/ui/dashboardVolunteer/sidenav";
import DashHeader from "@/app/components/DashHeader.jsx";
import "/app/styles/volunteerLayout.css";

/* body for page makes menu span entire height*/
export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <div className="page">
      <div className="headerSpace">
        <DashHeader />
      </div>

      <div className="mainContent">
        <div className="col-2 col-s-2 sideBarSpace">
          <SideNav />
        </div>
        <div className="col-10 col-s-9 testA">{children}</div>
      </div>

      <div className="footerSpace">
        <p className="testFooter">Wellness Center Coordination App 2024</p>
      </div>
    </div>
  );
}
