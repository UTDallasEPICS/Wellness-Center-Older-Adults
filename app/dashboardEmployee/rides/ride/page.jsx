"use client";
import React, { useState, useEffect } from 'react';
import RideMap from '../../../components/RideMap'; // Corrected import path

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
      <div style={{ width: '50%', padding: '20px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', margin: '0' }}>Ride #{rideDetails.id}</h2>
          <p style={{ margin: '0' }}>Date: {new Date().toLocaleDateString()}</p> 
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p style={{ margin: '5px 0' }}><strong>Trip</strong></p>
            <p style={{ margin: '5px 0' }}>A: {rideDetails.pickupAddress}</p>
            <p style={{ margin: '5px 0' }}>B: {rideDetails.dropoffAddress}</p>
            <p style={{ margin: '5px 0' }}>C: {rideDetails.dropoffAddress} </p> {/* Assuming final is same as dropoff */}
          </div>
          <p style={{ margin: '0' }}><strong>Pick-up Time</strong><br />{rideDetails.pickuplime}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ margin: '0' }}><strong>Client</strong><br />{rideDetails.customer?.name}</p>
          <p style={{ margin: '0' }}><strong>Drive Time</strong><br />A-B: {rideDetails.drivelineAll}<br />B-C: {rideDetails.drivetimeBC}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ margin: '0' }}><strong>Total Mileage</strong><br />{rideDetails.mileage}</p>
          <p style={{ margin: '0' }}><strong>Wait Time</strong><br />{rideDetails.waitline}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>Accept?</button>
          <p style={{ margin: '0' }}><strong>Notes</strong><br />N/A</p>
        </div>
      </div>
      <div style={{ width: '50%', height: '100vh' }}>
        <RideMap
          pickupAddress={rideDetails.pickupAddress}
          dropoffAddress={rideDetails.dropoffAddress}
          finalAddress={rideDetails.dropoffAddress}
        />
      </div>
    </div>
  );
}