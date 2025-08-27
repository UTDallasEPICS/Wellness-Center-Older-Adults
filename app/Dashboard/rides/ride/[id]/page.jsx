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
  const [waitTime, setWaitTime] = useState('');
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
        setWaitTime(data.waitTime || '');
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
      case 'waitTime':
        setWaitTime(value);
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
        waitTime,
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
        waitTime,
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
    setWaitTime(rideDetails.waitTime || '');
    setNotes(rideDetails.notes || '');
    setIsEditing(false);
  };

  const handleAcceptRide = async () => {
    // ... (rest of your handleAcceptRide function - no changes needed for editing)
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
    // ... (rest of your handleUnreserveRide function - no changes needed for editing)
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
    // ... (rest of your handleCompleteRide function - no changes needed for editing)
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

  let actionButton;
  if (rideDetails?.status === 'AVAILABLE' || rideDetails?.status === 'Added' || rideDetails?.status === 'Unreserved') {
    actionButton = (
      <button
        className="px-5 py-2 bg-[#419902] text-white rounded mr-2"
        onClick={handleAcceptRide}
      >
        Accept?
      </button>
    );
  } else if (rideDetails?.status === 'Reserved') {
    actionButton = (
      <>
        <button
          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded mr-2"
          onClick={handleUnreserveRide}
        >
          Unreserve
        </button>
        <button
          className="px-5 py-2 bg-green-500 hover:bg-[#419902] text-white rounded"
          onClick={handleCompleteRide}
        >
          Completed
        </button>
      </>
    );
  } else if (rideDetails?.status === 'Completed') {
    actionButton = null;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-5 bg-[#fffdf5] font-sans">
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">Ride #{rideDetails.id}</h2>
          <p className="m-0">Date: {rideDetails.date ? new Date(rideDetails.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not available'}</p>
        </div>

        {isEditing ? (
          <div>
            <div className="mb-5">
              <p className="my-1 font-semibold"><strong>Trip</strong></p>
              <label className="block my-1">A: <input type="text" name="pickupAddress" value={pickupAddress} onChange={handleInputChange} className="w-full border rounded py-1 px-2" /></label>
              <label className="block my-1">B: <input type="text" name="dropoffAddress" value={dropoffAddress} onChange={handleInputChange} className="w-full border rounded py-1 px-2" /></label>
            </div>

            <div className="flex justify-between mb-5">
              <label>
                <strong>Pick-up Time</strong><br />
                <input type="text" name="pickupTime" value={pickupTime} onChange={handleInputChange} className="border rounded py-1 px-2" />
              </label>
            </div>

            <div className="flex justify-between mb-5">
              <p className="m-0"><strong>Client</strong><br />{rideDetails.customer?.name}</p>
              <label><strong>Drive Time</strong><br />A-B: <input type="text" name="driveTimeAB" value={driveTimeAB} onChange={handleInputChange} className="border rounded py-1 px-2" /></label>
            </div>

            <div className="flex justify-between mb-5">
              <label><strong>Total Mileage</strong><br /><input type="text" name="mileage" value={mileage} onChange={handleInputChange} className="border rounded py-1 px-2" /></label>
              <label><strong>Wait Time</strong><br /><input type="text" name="waitTime" value={waitTime} onChange={handleInputChange} className="border rounded py-1 px-2" /></label>
            </div>

            <div className="mb-5">
              <label className="block"><strong>Notes</strong><br /><textarea name="notes" value={notes} onChange={handleInputChange} className="w-full border rounded py-1 px-2"></textarea></label>
            </div>

            <div className="flex justify-start mb-5">
              <button className="px-5 py-2 bg-green-500 text-white rounded mr-2" onClick={handleSaveClick}>Save</button>
              <button className="px-5 py-2 bg-gray-300 text-gray-700 rounded" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
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
              <p className="m-0"><strong>Drive Time</strong><br />A-B: {rideDetails.driveTimeAB}</p>
            </div>

            <div className="flex justify-between mb-5">
              <p className="m-0"><strong>Total Mileage</strong><br />{rideDetails.mileage}</p>
              <p className="m-0"><strong>Wait Time</strong><br />{rideDetails.waitTime || 'N/A'}</p>
            </div>

            <div className="flex justify-between mb-5">
              {actionButton}
              <p className="m-0"><strong>Notes</strong><br />{rideDetails.notes || 'N/A'}</p>
            </div>

            <button className="px-5 py-2 bg-blue-500 text-white rounded" onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>
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