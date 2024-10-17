"use client";
import { useEffect, useState } from 'react';

export default function test() {
  const [volunteer, setVolunteer] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchVolunteer() {
      try {
        const response = await fetch('/api/getVolunteer');
        const data = await response.json();

        if (response.ok) {
          setVolunteer(data);
        }
        else{
          setError(data.error);
        }
      } catch (error) {
        setError('Error fetching volunteer data');
        console.error(error);
      }
    }

    fetchVolunteer();
  }, []);

  if (error) {
    return (<div>
      Error: {error}
    </div>);
  }

  if (!volunteer) {
    return (<div>
      Loading volunteer...
    </div>);
  }

  return(
    <div>
      <h1>Volunteer Information</h1>
      <p><strong>First Name:</strong> {volunteer.volunteerFname}</p>
      <p><strong>Last Name:</strong> {volunteer.volunteerLname}</p>
      <p><strong>Email:</strong> {volunteer.volunteerEmail}</p>
      <p><strong>Phone:</strong> {volunteer.volunteerPhone}</p>
      <p><strong>Ride Status:</strong> {volunteer.rideStatus}</p>
    </div>
  );


}