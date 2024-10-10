import React from 'react';
import newMockData from '../mockdata/mock-data-new.js';
import '../styles/recentActivity.css';

const RecentActivity = () => {
  const activities = Array.isArray(newMockData) ? newMockData : [];

  return (
    <div className="recent-activity-container">
      <h2>Recent Activity</h2>
      <ul className="activity-list">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity.id} className="activity-item">
              <div className="activity-details">
                <div className="activity-header">
                  <strong>{activity.date}</strong> at {activity.time}
                </div>
                <div><strong>Client Name:</strong> {activity.clientName}</div>
                
                <div><strong>Start Time:</strong> {activity.startTime}</div>
                <div><strong>Volunteer Name:</strong> {activity.volunteerName}</div>
                <div><strong>Status:</strong> {activity.status}</div>
                <div><strong>Hours:</strong> {activity.hours}</div>
              </div>
              <div className="activity-status-icon">
                {activity.status === "Completed" ? "✔️" : "🚗"}
              </div>
            </li>
          ))
        ) : (
          <p>No recent activity available.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentActivity;

/*
<div><strong>Phone Number:</strong> {activity.phoneNumber}</div>
<div><strong>Address:</strong> {activity.address}</div>
*/