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
        setRideDetails(data);
        setPickupAddress(data.pickupAddress || '');
        setDropoffAddress(data.dropoffAddress || '');
        setPickupTime(data.pickupTime || '');
        setDriveTimeAB(data.driveTimeAB || '');
        setMileage(data.mileage || '');
        setNotes(data.notes || '');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'pickupAddress':
        setPickupAddress(value);
        break;
      case 'dropoffAddress':
        setDropoffAddress(value);
        break;
      case 'pickupTime':
        setPickupTime(value);
        break;
      case 'driveTimeAB':
        setDriveTimeAB(value);
        break;
      case 'mileage':
        setMileage(value);
        break;
      case 'notes':
        setNotes(value);
        break;
      default:
        break;
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
      if (!response.ok) {
        throw new Error(`Failed to update ride details: ${response.status}`);
      }

      const updatedRideDetails = {
        ...rideDetails,
        pickupAddress,
        dropoffAddress,
        pickupTime,
        driveTimeAB,
        mileage,
        notes,
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Reserved' }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update ride status: ${response.status}`);
        }

        setRideDetails({ ...rideDetails, status: 'Reserved' }); // Update local state
        router.push('/Dashboard/rides?tab=reserved');
      } catch (err) {
        console.error("Error updating ride status:", err);
        setError("Failed to reserve ride.");
      }
    }
  };

  const handleUnreserveRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'AVAILABLE' }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update ride status: ${response.status}`);
        }

        setRideDetails({ ...rideDetails, status: 'AVAILABLE' }); // Update local state
        router.push('/Dashboard/rides?tab=available');
      } catch (err) {
        console.error("Error updating ride status:", err);
        setError("Failed to unreserve ride.");
      }
    }
  };

  const handleCompleteRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Completed' }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update ride status: ${response.status} - ${errorData?.error || 'Unknown error'}`);
        }

        setRideDetails({ ...rideDetails, status: 'Completed' }); // Update local state
        router.push('/Dashboard/rides?tab=completed');
      } catch (err) {
        console.error("Error updating ride status to Completed:", err);
        setError("Failed to mark ride as completed.");
      }
    }
  };
 
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Details and Actions */}
      <div className="w-1/2 p-10 bg-[#fffdf5] shadow-lg flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-gray-800">Ride #{rideDetails.id}</h2>
            <p className="text-gray-600">Date: {rideDetails.date ? new Date(rideDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
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
                <label>
                  <span className="font-semibold text-gray-700">Wait Time</span>
                  <input type="text" name="waitTime" value={waitTime} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors" />
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
                <div className="flex flex-col text-right">
                  <p className="font-semibold text-gray-700">Wait Time</p>
                  <p className="text-gray-600">{rideDetails.waitTime || 'N/A'}</p>
                </div>
                <div className="flex flex-col col-span-2">
                  <p className="font-semibold text-gray-700">Notes</p>
                  <p className="text-gray-600">{rideDetails.notes || 'N/A'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                {rideDetails.status === 'AVAILABLE' || rideDetails.status === 'Added' || rideDetails.status === 'Unreserved' ? (
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
      </div>
      
      {/* Right Side: Map */}
      <div className="w-1/2 h-screen">
        {console.log({ rideDetails: rideDetails })}
        {rideDetails?.pickupAddress && rideDetails?.dropoffAddress && (
          <RideMap
            pickupAddress={isEditing ? pickupAddress : rideDetails.pickupAddress}
            dropoffAddress={isEditing ? dropoffAddress : rideDetails.dropoffAddress}
            finalAddress={isEditing ? dropoffAddress : rideDetails.dropoffAddress}
          />
        )}
      </div>
    </div>
  );
}