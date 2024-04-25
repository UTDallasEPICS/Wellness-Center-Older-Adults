import "app/styles/dashboardPage.css";
import "app/styles/dashboard.css"
import TestContainer from "app/components/TestContainer.jsx";

export default function Page() {
  return (
    <main className="main-content">
    <div className="card-header">
      <div className="title-bar">
        <div className="title">Your Activity</div>
        <div className="toggle"></div>
      </div>
    </div>
    <div className="card large"></div>
    <div className="card small"></div>
    <div className="card medium"></div>
    <div className="card medium"></div>
  </main>
  );
}
