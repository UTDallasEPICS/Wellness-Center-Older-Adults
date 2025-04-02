"use client";
import React, { useState, useEffect } from 'react';
import RideMap from '../../../components/RideMap';

export default function Ride() {
  const [rideDetails, setRideDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await fetch('/api/ride/get/6');
        if (!response.ok) {
          throw new Error(`Failed to fetch ride details: ${response.status}`);
        }
        const data = await response.json();
        setRideDetails(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRideDetails();
  }, []);

  if (error) return <div className="error">Error: {error}</div>;
  if (!rideDetails) return <div className="loading">Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', padding: '20px' }}> 
        <h2>Ride #{rideDetails.id}</h2>
        <p><strong>Pickup Address:</strong> {rideDetails.pickupAddress}</p>
        <p><strong>Dropoff Address:</strong> {rideDetails.dropoffAddress}</p>
        <p><strong>Pickup Time:</strong> {rideDetails.pickuplime}</p>
        <p><strong>Client Name:</strong> {rideDetails.customer?.name}</p>
        <p><strong>Mileage:</strong> {rideDetails.mileage}</p>
        <p><strong>Status:</strong> {rideDetails.status}</p>
        <p><strong>Drive Time AB:</strong> {rideDetails.drivelineAll}</p>
        <p><strong>Drive Time BC:</strong> {rideDetails.drivetimeBC}</p>
        <p><strong>Wait Time:</strong> {rideDetails.waitline}</p>
      </div>
      <div style={{ width: '50%', height: '100vh' }}> {/* Map on the right */}
        <RideMap
          pickupAddress={rideDetails.pickupAddress}
          dropoffAddress={rideDetails.dropoffAddress}
          finalAddress={rideDetails.dropoffAddress} // or a finalAddress from rideDetails or a new source.
        />
      </div>
    </div>
  );
}