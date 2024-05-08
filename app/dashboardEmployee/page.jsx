import "app/styles/dashboardPage.css";
import TestContainer from "app/components/TestContainer.jsx";

export default function Page() {
  return (
    <div className="dashContainer">
      <h1 className="dashTitle">Dashboard</h1>
      <div className="dashBoxes">
        <TestContainer text="Number of Recently Completed Rides" number="3" />
        <TestContainer text="This Week's Volunteer Hours" number="5" />
        <TestContainer text="Total Rides for the Week" number="17" />
      </div>
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
