import SideNav from "@/app/ui/dashboardEmployee/sidenav";
import "/app/styles/employeeLayout.css";
/* body for page makes menu span entire height*/
export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <div className="page">
      <div className="headerSpace">
        <a href="/">
          <p className="headerText">WCOA</p>
        </a>
      </div>

      <div className="mainContent">
        <div className="col-2 col-s-2 sideBarSpace">
          <SideNav />
        </div>
        <div className="col-10 col-s-9 testA">{children}</div>
      </div>

      
    </div>
  );
}
