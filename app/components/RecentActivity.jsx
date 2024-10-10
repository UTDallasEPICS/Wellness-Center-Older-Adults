import React from 'react';
import newMockData from '../mockdata/mock-data-new.js';

const RecentActivity = () => {
  const activities = Array.isArray(newMockData) ? newMockData : [];

  return (
    <div className="p-5 md:p-10 mt-10 mx-auto bg-green-100 w-full max-w-6xl rounded-2xl shadow-md">
      <h2>Recent Activity</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full p-2.5">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity.id} className="border border-gray-300 p-4 mb-4 rounded-2xl bg-white grid grid-cols-[1fr_auto] gap-2.5 items-start shadow-md">
              <div className="activity-details">
                <div className="activity-header">
                  <strong>{activity.date}</strong> at {activity.time} 
                </div>
                <div><strong>Client Name:</strong> {activity.clientName}</div>
                <div><strong>Phone Number:</strong> {activity.phoneNumber}</div>
                <div><strong>Address:</strong> {activity.address}</div>
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
