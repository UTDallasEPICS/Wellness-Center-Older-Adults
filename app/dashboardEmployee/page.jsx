import "/app/styles/dashboardPage.css";
import TextContainer from "/app/components/TextContainer.jsx";
import RecentActivity from "/app/components/RecentActivity"; 

export default function Page() {
  return (
    <div className="dashContainer">
      <h1 className="dashTitle">Dashboard</h1>
      <div className="dashBoxes">
        <TextContainer text="Recently Completed Rides" number="3" />
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
      <RecentActivity />
    </div>

    /* 
    <main className="main-content">
      <div className="card-header">
        <div className="title-bar">
          <div className="title">Dashboard</div>
        </div>
      </div>

      <div className="card small"></div>
      <div className="card medium"></div>
      <div className="card medium"></div>
    </main>
    */
  );
}
