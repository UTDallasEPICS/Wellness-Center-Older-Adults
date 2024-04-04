import React from 'react';
import 'app/styles/dashboard.css'; 

function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">Dashboard ▼</div>
        <div className="header-settings">⚙️ Settings</div>
      </header>
      <div className="dashboard-body">
        <nav className="sidebar">
          <div className="sidebar-item active"> Dashboard</div>
          <div className="sidebar-item"> Drives</div>
          <div className="sidebar-item"> Hours</div>
        </nav>
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
      </div>
    </div>
  );
}

export default Dashboard;
