import React, { useState, useEffect } from 'react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch('/api/rides/getRides');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const rides = await response.json();
        rides.sort((a, b) => new Date(b.date) - new Date(a.date));

        const mappedActivities = rides.map((ride) => {
           const volunteerName = ride.volunteer ? `${ride.volunteer?.firstName ?? ''} ${ride.volunteer?.lastName ?? ''}`.trim() : 'Unassigned';

          let actionText = '';
          if (ride.status === "Completed") {
            actionText = `${volunteerName} completed ride #${ride.rideID}`;
          } else if (ride.status === "Reserved") {
            actionText = `${volunteerName} accepted ride #${ride.rideID}`;
          } else {
            actionText = `Admin added ride #${ride.rideID}`;
          }

          return {
            id: ride.rideID,
            action: actionText,
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
    <div className="p-5 md:p-10 mt-10 ml-[%5] bg-[#f4f1f0] w-[50%] max-w-6xl rounded-2xl">
      <h2>Recent Activity</h2>
      <ul className="bg-white w-full p-2.5 rounded-2xl">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity.id} className="p-2">
              {activity.action}
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
