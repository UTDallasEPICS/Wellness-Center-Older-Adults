"use client";
import RideMap from '../../../../components/RideMap';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function Ride() {
    const { id } = useParams();
    const [rideDetails, setRideDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await fetch(`/api/ride/get/${id}`);
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
    }, [id]);

    if (error) return <div className="text-red-600">Error: {error}</div>;
    if (!rideDetails) return <div className="animate-pulse">Loading...</div>;

    function formatTime(timeString) {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        let formattedHours = parseInt(hours, 10);
        const formattedMinutes = String(minutes).padStart(2, "0");
        const ampm = formattedHours >= 12 ? 'PM' : 'AM';
        formattedHours = formattedHours % 12;
        formattedHours = formattedHours ? formattedHours : 12;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/2 p-5 bg-gray-100 font-sans">
                <div className="flex justify-between mb-5">
                    <h2 className="text-2xl font-bold">Ride #{rideDetails.id}</h2>
                    <p className="m-0">Date: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="flex justify-between mb-5">
                    <div>
                        <p className="my-1 font-semibold"><strong>Trip</strong></p>
                        <p className="my-1">A: {rideDetails.pickupAddress}</p>
                        <p className="my-1">B: {rideDetails.dropoffAddress}</p>
                    </div>
                    <p className="m-0">
                        <strong>Pick-up Time</strong><br />
                        {rideDetails.pickupTime
                            ? formatTime(new Date(rideDetails.pickupTime).toLocaleTimeString('en-US', { hour12: false }))
                            : 'N/A'}
                    </p>
                </div>

                <div className="flex justify-between mb-5">
                    <p className="m-0"><strong>Client</strong><br />{rideDetails.customer?.name}</p>
                    <p className="m-0"><strong>Drive Time</strong><br />A-B: {rideDetails.driveTimeAB}<br />B-C: {rideDetails.driveTimeBC || 'N/A'}</p>
                </div>

                <div className="flex justify-between mb-5">
                    <p className="m-0"><strong>Total Mileage</strong><br />{rideDetails.mileage}</p>
                </div>

                <div className="flex justify-between mb-5">
                    <button className="px-5 py-2 bg-green-500 text-white rounded">Accept?</button>
                    <p className="m-0"><strong>Notes</strong><br />N/A</p>
                </div>
            </div>
            <div className="w-1/2 h-screen">
                {console.log({ rideDetails: rideDetails.pickupAddress })}
                <RideMap
                    pickupAddress={rideDetails.pickupAddress}
                    dropoffAddress={rideDetails.dropoffAddress}
                    finalAddress={rideDetails.dropoffAddress}
                />
            </div>
        </div>
    );
}