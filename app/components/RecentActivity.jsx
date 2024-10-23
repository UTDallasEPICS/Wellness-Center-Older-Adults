import React, { useState, useEffect } from 'react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch('/api/getRides');
        if(!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const rides = await response.json();


        const mappedActivities = rides.map((ride) => {
          const formattedDate = new Date(ride.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const rideTime = new Date(ride.time); // This will handle the ISO string correctly
          const formattedTime = rideTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // Use 12-hour format
          });
        
          return {
            id: ride.rideID,
            date: formattedDate,
            time: formattedTime,
            clientName: `${ride.customer.firstName} ${ride.customer.lastName}`,
            phoneNumber: ride.customer.customerPhone,
            address: `${ride.customer.streetAddress}, ${ride.customer.city}, ${ride.customer.zipcode}`,
            startTime: formattedTime,
            volunteerName: `${ride.volunteer.firstName} ${ride.volunteer.lastName}`,
            status: 'Completed', 
            hours: '3 hrs',
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
            <li key={activity.id} className="border border-gray-300 p-4 mb-4 rounded-2xl bg-white grid grid-cols-[1fr_auto] gap-2.5 items-start shadow-md">
              <div className="activity-details">
                <div className="activity-header">
                  <strong>{activity.date}</strong>
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
