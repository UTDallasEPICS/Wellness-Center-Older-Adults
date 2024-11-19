"use client";
import { useEffect, useState } from 'react';

export default function test() {
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const response = await fetch('/api/getAllVolunteers');
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setVolunteers(data);
        }
        else{
          setError(data.error);
        }
      } catch (error) {
        setError('Error fetching volunteers data');
        console.error(error);
      }
    }

    fetchVolunteers();
  }, []);

  if (error) {
    return (<div>
      Error: {error}
    </div>);
  }

  if (!volunteers) {
    return (<div>
      Loading volunteers...
    </div>);
  }

  return(
    <div>
      <h1>All Volunteer Information</h1>
      {volunteers.map((volunteer, index) => (
        <div key={index}>
          <p><strong>First Name:</strong> {volunteer.firstName}</p>
          <p><strong>Last Name:</strong> {volunteer.lastName}</p>
          <p><strong>Email:</strong> {volunteer.email}</p>
          <p><strong>Phone Number:</strong> {volunteer.phone}</p>
          <p><strong>Status:</strong> {volunteer.status}</p>
          <hr />
        </div>
      ))}
      </div>
  );


}