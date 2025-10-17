"use client";
import RideMap from '../../../../components/RideMap';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Ride() {
  const { id } = useParams();
  const router = useRouter();
  const [rideDetails, setRideDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [driveTimeAB, setDriveTimeAB] = useState('');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await fetch(`/api/ride/get/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ride details: ${response.status}`);
        }
        const data = await response.json();
        
        // Ensure data fields exist, defaulting to empty strings if null/undefined
        const enrichedData = {
          ...data,
          finalAddress: data.finalAddress || data.pickupAddress || '', // Assuming C is often the return to A
          wait_time: data.wait_time || '', 
          mileage: data.mileage || '',
          driveTimeAB: data.driveTimeAB || '',
          pickupTime: data.pickupTime || '',
          customer: data.customer || { name: '' },
          notes: data.notes || '',
        };
        
        setRideDetails(enrichedData);
        setPickupAddress(enrichedData.pickupAddress || '');
        setDropoffAddress(enrichedData.dropoffAddress || '');
        setPickupTime(enrichedData.pickupTime || '');
        setDriveTimeAB(enrichedData.driveTimeAB || '');
        setMileage(enrichedData.mileage || '');
        setNotes(enrichedData.notes || '');
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRideDetails();
  }, [id]);

  if (error) return <div className="text-red-600 p-5">Error: {error}</div>;
  if (!rideDetails) return <div className="animate-pulse p-5">Loading...</div>;

  // Formats time from 24-hour string (e.g., "21:30") to "9:30 pm"
  function formatTime(timeString) {
    if (!timeString) return "";
    try {
        const [hours, minutes] = timeString.split(":").map(n => parseInt(n, 10));
        const date = new Date(0, 0, 0, hours, minutes);
        const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return formattedTime.toLowerCase();
    } catch {
        return timeString;
    }
  }

  // Formats date to match the image: e.g., "7/7/25"
  function formatDate(dateInput) {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput; 

    const year = date.getFullYear().toString().slice(-2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}/${year}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'pickupAddress': setPickupAddress(value); break;
      case 'dropoffAddress': setDropoffAddress(value); break;
      case 'pickupTime': setPickupTime(value); break;
      case 'driveTimeAB': setDriveTimeAB(value); break;
      case 'mileage': setMileage(value); break;
      case 'notes': setNotes(value); break;
      default: break;
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`/api/rides/${rideDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickupAddress,
          dropoffAddress,
          pickupTime,
          driveTimeAB,
          mileage,
           notes,
        }),
      });
      if (!response.ok) { throw new Error(`Failed to update ride details: ${response.status}`); }

      const updatedRideDetails = {
        ...rideDetails,
        pickupAddress, dropoffAddress, pickupTime, driveTimeAB, mileage, notes,
      };
      setRideDetails(updatedRideDetails);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating ride details:", err);
      setError("Failed to save ride details.");
    }
  };

  const handleCancelEdit = () => {
    setPickupAddress(rideDetails.pickupAddress || '');
    setDropoffAddress(rideDetails.dropoffAddress || '');
    setPickupTime(rideDetails.pickupTime || '');
    setDriveTimeAB(rideDetails.driveTimeAB || '');
    setMileage(rideDetails.mileage || '');
    setNotes(rideDetails.notes || '');
    setIsEditing(false);
  };

  const handleAcceptRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ status: 'Reserved' }),
        });
        if (!response.ok) { throw new Error(`Failed to update ride status: ${response.status}`); }
        setRideDetails({ ...rideDetails, status: 'Reserved' });
        router.push('/Dashboard/rides?tab=reserved');
      } catch (err) { console.error("Error updating ride status:", err); setError("Failed to reserve ride."); }
    }
  };

  const handleUnreserveRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ status: 'AVAILABLE' }),
        });
        if (!response.ok) { throw new Error(`Failed to update ride status: ${response.status}`); }
        setRideDetails({ ...rideDetails, status: 'AVAILABLE' });
        router.push('/Dashboard/rides?tab=available');
      } catch (err) { console.error("Error updating ride status:", err); setError("Failed to unreserve ride."); }
    }
  };

  const handleCompleteRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ status: 'Completed' }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update ride status: ${response.status} - ${errorData?.error || 'Unknown error'}`);
        }
        setRideDetails({ ...rideDetails, status: 'Completed' });
        router.push('/Dashboard/rides?tab=completed');
      } catch (err) { console.error("Error updating ride status to Completed:", err); setError("Failed to mark ride as completed."); }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-5 bg-[#f4f1f0] font-sans">
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">Ride #{rideDetails.id}</h2>
          <p className="m-0">Date: {rideDetails.date ? new Date(rideDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not available'}</p>
        </div>

        {/* Details Section */}
        {isEditing ? (
          <div className="space-y-4">
            {/* Trip Edit */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">Trip</p>
              <div className="space-y-2">
                <label className="block text-sm">
                  <span className="font-medium text-gray-500">A:</span>
                  <input type="text" name="pickupAddress" value={pickupAddress} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-gray-500">B:</span>
                  <input type="text" name="dropoffAddress" value={dropoffAddress} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors" />
                </label>
              </div>
            </div>

            {/* Other Edit Fields */}
            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="font-semibold text-gray-700">Pick-up Time</span>
                <input type="text" name="pickupTime" value={pickupTime} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors" />
              </label>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-700">Client</p>
                <p className="mt-1 text-gray-800">{rideDetails.customer?.name}</p>
              </div>
              <label>
                <span className="font-semibold text-gray-700">Drive Time</span>
                <input type="text" name="driveTimeAB" value={driveTimeAB} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors" />
              </label>
              <label>
                <span className="font-semibold text-gray-700">Total Mileage</span>
                <input type="text" name="mileage" value={mileage} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors" />
              </label>
              <label className="col-span-2">
                <span className="font-semibold text-gray-700">Notes</span>
                <textarea name="notes" value={notes} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors"></textarea>
              </label>
            </div>

            {/* Edit Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-grow px-5 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition-colors" onClick={handleSaveClick}>Save</button>
              <button className="flex-grow px-5 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-lg hover:bg-gray-300 transition-colors" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Trip Details */}
            <div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-700">Trip</p>
                  <p className="text-gray-600">A: {rideDetails.pickupAddress}</p>
                  <p className="text-gray-600">B: {rideDetails.dropoffAddress}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-700">Pick-up Time</p>
                  <p className="text-gray-600">{rideDetails.pickupTime ? formatTime(rideDetails.pickupTime) : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <p className="font-semibold text-gray-700">Client</p>
                <p className="text-gray-600">{rideDetails.customer?.name}</p>
              </div>
              <div className="flex flex-col text-right">
                <p className="font-semibold text-gray-700">Drive Time</p>
                <p className="text-gray-600">{rideDetails.driveTimeAB}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-700">Total Mileage</p>
                <p className="text-gray-600">{rideDetails.mileage}</p>
              </div>
              <div className="flex flex-col col-span-2">
                <p className="font-semibold text-gray-700">Notes</p>
                <p className="text-gray-600">{rideDetails.notes || 'N/A'}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              {(rideDetails.status === 'AVAILABLE' || rideDetails.status === 'Added' || rideDetails.status === 'Unreserved') ? (
                <>
                  <button className="flex-grow px-5 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition-colors" onClick={handleAcceptRide}>Accept?</button>
                  <button className="flex-grow px-5 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-lg hover:bg-gray-300 transition-colors" onClick={handleEditClick}>Edit</button>
                </>
              ) : rideDetails.status === 'Reserved' ? (
                <>
                  <button className="flex-grow px-5 py-3 bg-yellow-500 text-white font-semibold rounded-md shadow-lg hover:bg-yellow-600 transition-colors" onClick={handleUnreserveRide}>Unreserve</button>
                  <button className="flex-grow px-5 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition-colors" onClick={handleCompleteRide}>Completed</button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
      
      {/* Right Side: Map */}
      <div className="w-1/2 h-full">
        {rideDetails?.pickupAddress && rideDetails?.dropoffAddress && (
          <RideMap
            pickupAddress={isEditing ? pickupAddress : rideDetails.pickupAddress}
            dropoffAddress={isEditing ? dropoffAddress : rideDetails.dropoffAddress}
            finalAddress={isEditing ? dropoffAddress : rideDetails.finalAddress} 
          />
        )}
      </div>
    </div>
  );
}