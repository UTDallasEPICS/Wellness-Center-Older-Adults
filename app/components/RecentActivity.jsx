import React from 'react';
import { useState, useEffect } from 'react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch('/api/rides/getRides');
        if(!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const rides = await response.json();
        rides.sort((a, b) => new Date(b.date) - new Date(a.date));


        const mappedActivities = rides.map((ride) => {
          const formattedDate = new Date(ride.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const rideStartTime = new Date(ride.startTime); 
          const formattedStartTime = rideStartTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, 
            timeZone: 'UTC'
          });

          const rideEndTime = new Date(ride.endTime); 
          const formattedEndTime = rideEndTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, 
            timeZone: 'UTC'
          });

          const volunteerName = ride.volunteer ? `${ride.volunteer?.firstName ?? ''} ${ride.volunteer?.lastName ?? ''}`.trim() : 'Unassigned';
          
          const durationMilliseconds = rideEndTime - rideStartTime;
          const durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
          const durationMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

          const hours = `${durationHours} hrs${durationMinutes > 0 ? ` ${durationMinutes} mins` : ''}`;

          return {
            id: ride.rideID,
            date: formattedDate,
            clientName: `${ride.customerName}`,
            phoneNumber: ride.customer.customerPhone,
            address: `${ride.customer.streetAddress}, ${ride.customer.city}, ${ride.customer.zipcode}`,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            volunteerName: volunteerName,
            status: ride.status, 
            hours: hours,
          };
        });

        setActivities(mappedActivities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rides:', error);
        setError('Failed to load recent activity.');
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-5 md:p-10 mt-10 mx-auto bg-grey-100 w-full max-w-6xl rounded-2xl shadow-md">
      <h2>Recent Activity</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full p-2.5">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity.id} className="border border-gray-300 p-4 mb-4 rounded-2xl bg-[#e2dbd0]/70 grid grid-cols-[1fr_auto] gap-2.5 items-start"
            style={{
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
  }}>
              <div className="activity-details">
                <div className="activity-header">
                  <strong>{activity.date}</strong> at {activity.startTime} 
                </div>
                <div><strong>Client Name:</strong> {activity.clientName}</div>
                
                <div><strong>Start Time:</strong> {activity.startTime}</div>
                <div><strong>End Time:</strong> {activity.endTime}</div>
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