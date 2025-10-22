"use client";
import RideMap from '../../../../components/RideMap';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TotalTimeModal from '../../../../components/TotalTimeModal.jsx';

export default function Ride() {
  const { id } = useParams();
  const router = useRouter();
  const [rideDetails, setRideDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  // driveTimeAB state holds the ESTIMATED time (A->B)
  const [driveTimeAB, setDriveTimeAB] = useState('');
  const [mileage, setMileage] = useState('');
  // totalTime state holds the LOGGED/ACTUAL time (from DB 'totalTime' field)
  const [totalTime, setTotalTime] = useState(''); 
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // === HELPER FUNCTIONS (DEFINED BEFORE USE) ===
  
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
  // === END HELPER FUNCTIONS ===

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await fetch(`/api/ride/get/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ride details: ${response.status}`);
        }
        const data = await response.json();
        
        const enrichedData = {
          ...data,
          finalAddress: data.finalAddress || data.pickupAddress || '', 
          wait_time: data.wait_time || '', 
          mileage: data.mileage || '',
          driveTimeAB: data.driveTimeAB || '',   // Estimated time (used as base for modal)
          totalTime: data.totalTime || '',       // Logged time (DB field)
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
        
        // Initialization for the LOGGED time display field
        setTotalTime(enrichedData.totalTime || '');
        
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRideDetails();
  }, [id]);

  if (error) return <div className="text-red-600 p-5">Error: {error}</div>;
  if (!rideDetails) return <div className="animate-pulse p-5">Loading...</div>;

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
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ pickupAddress, dropoffAddress, pickupTime, driveTimeAB, mileage, notes, }),
      });
      if (!response.ok) { throw new Error(`Failed to update ride details: ${response.status}`); }

      const updatedRideDetails = {
        ...rideDetails,
        pickupAddress, dropoffAddress, pickupTime, driveTimeAB, mileage, notes,
      };
      setRideDetails(updatedRideDetails);
      setDriveTimeAB(updatedRideDetails.driveTimeAB); 
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
          body: JSON.stringify({ status: 'AVAILABLE', volunteerID: null }),
        });
        if (!response.ok) { 
          const errorData = await response.json();
          throw new Error(`Failed to update ride status: ${response.status} - ${errorData?.error || 'Unknown error'}`); 
        }
        setRideDetails({ ...rideDetails, status: 'AVAILABLE' });
        router.push('/Dashboard/rides?tab=available');
      } catch (err) { 
        console.error("Error updating ride status:", err); 
        setError("Failed to unreserve ride."); 
      }
    }
  };
  
  const handleOpenTimeModal = () => {
      setIsTimeModalOpen(true);
  };

  // NEW HANDLER: Opens the modal specifically for editing the logged time
  const handleEditLoggedTime = () => {
    // Only allow editing if the ride status is Reserved or Completed
    if (rideDetails.status === 'Reserved' || rideDetails.status === 'Completed') {
      setIsTimeModalOpen(true);
    }
  };
  
  const handleSaveCompletion = async (driveData) => {
    if (rideDetails) {
      try {
        const newTotalTimeString = `${driveData.hours} hr ${driveData.minutes} min`;
        const newNotes = driveData.notes.trim();
        
        // Determine status: If already Completed, keep it. Otherwise, mark as Completed.
        const statusToUse = rideDetails.status === 'Completed' ? 'Completed' : 'Completed'; 
        
        const updatePayload = {
            status: statusToUse,
            driveTimeAB: newTotalTimeString, 
            notes: newNotes, 
        };
        
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify(updatePayload),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update ride: ${response.status} - ${errorData?.error || 'Unknown error'}`);
        }
        
        const responseData = await response.json();
        const { updatedRide } = responseData; 
        
        // --- FIX 1: Update state to reflect changes ---
        setTotalTime(updatedRide.totalTime); 
        setNotes(updatedRide.specialNote);   
        
        setRideDetails(prevDetails => ({ 
            ...prevDetails, 
            status: statusToUse,
            totalTime: updatedRide.totalTime,
            notes: updatedRide.specialNote,
        }));
        
        // Close the modal, allowing the page to re-render with the new time visible
        setIsTimeModalOpen(false);

        // --- FIX 2: Conditional Redirection ---
        // Only redirect if the status actually changed to 'Completed' from something else.
        if (statusToUse === 'Completed' && rideDetails.status !== 'Completed') {
             router.push('/Dashboard/rides?tab=completed');
        }
        // If the ride was already 'Completed' (editing time), we stay on the page.
        
      } catch (err) { 
          console.error("Error saving logged time:", err); 
          setError("Failed to save time/notes."); 
      }
    }
  };
  
  const handleCloseTimeModal = () => {
      setIsTimeModalOpen(false);
  };


  return (
    <div className="flex w-full h-full bg-white font-sans text-gray-800">
      
      {/* Left Side: Ride Details Panel */}
      <div className="w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
        
        <div className="flex-grow">
            {/* Header */}
            <div className="flex justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-4xl font-normal">Ride #{rideDetails.id}</h2>
                <p className="text-gray-600 font-normal text-xl mt-2">Date: {formatDate(rideDetails.date)}</p>
            </div>

            {/* Content Display (Non-Editing Mode) */}
            {!isEditing ? (
                <div className="space-y-6">
                    {/* Trip Details */}
                    <div className="space-y-2">
                        <p className="text-xl font-bold mb-2">Trip</p>
                        <div className="text-sm pl-4 border-l-4 border-yellow-500 text-gray-700 space-y-1">
                            <p><span className="font-bold text-gray-900">A:</span> {rideDetails.pickupAddress}</p>
                            <p><span className="font-bold text-gray-900">B:</span> {rideDetails.dropoffAddress}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-4">
                        {/* Row 1: Client and Pick-up Time */}
                        <div className="flex flex-col">
                            <p className="text-xl font-bold mb-1">Client</p>
                            <p className="text-gray-700 text-base">{rideDetails.customer?.name || ''}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xl font-bold mb-1">Pick up Time</p>
                            <p className="text-gray-700 text-base">{formatTime(rideDetails.pickupTime)}</p>
                        </div>

                        {/* Row 2: Total Mileage and Drive Time (Estimated) */}
                        <div className="flex flex-col">
                            <p className="text-xl font-bold mb-1">Total Mileage</p>
                            <p className="text-gray-700 text-base">{mileage}</p>
                        </div>
                        
                        {/* DISPLAY 1: DRIVE TIME (ESTIMATE) */}
                        <div className="flex flex-col">
                            <p className="text-xl font-bold mb-1">Drive Time (Est.)</p>
                            <p className="text-gray-700 text-base">{driveTimeAB}</p>
                        </div>
                        
                        {/* DISPLAY 2: TOTAL TIME (LOGGED TIME) */}
                        <div className="flex flex-col">
                            {/* MAKE THE LABEL CLICKABLE */}
                            <p 
                                className={`text-xl font-bold mb-1 ${totalTime ? 'cursor-pointer text-blue-600 hover:text-blue-800 transition-colors' : 'text-gray-800'}`}
                                onClick={handleEditLoggedTime}
                            >
                                Total Time (Logged)
                            </p>
                            <p 
                                className={`text-gray-700 text-base ${totalTime ? 'cursor-pointer' : ''}`}
                                onClick={handleEditLoggedTime}
                            >
                                {totalTime || 'Click to Log Time'}
                            </p>
                        </div>
                        
                        {/* Row 4: Notes (Using the updated 'notes' state) */}
                        <div className="flex flex-col col-span-2">
                            <p className="text-xl font-bold mb-1">Notes</p>
                            <p className="text-gray-700 text-base">{notes}</p>
                        </div>
                    </div>
                </div>
            ) : (
                // --- EDITING MODE --- 
                <div className="space-y-6">
                    {/* Trip Edit */}
                    <div className="pt-2">
                        <p className="font-light text-gray-700 text-lg mb-2">Trip</p>
                        <div className="space-y-3 pl-4 border-l-4 border-green-600 text-sm">
                            <label className="block">
                                <span className="font-medium text-gray-500 block">A:</span>
                                <input type="text" name="pickupAddress" value={pickupAddress} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors p-2 text-gray-700" />
                            </label>
                            <label className="block">
                                <span className="font-medium text-gray-500 block">B:</span>
                                <input type="text" name="dropoffAddress" value={dropoffAddress} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors p-2 text-gray-700" />
                            </label>
                            <label className="block">
                                <span className="font-medium text-gray-500 block">C:</span>
                                <input type="text" name="finalAddress" value={rideDetails.finalAddress || ''} disabled className="w-full mt-1 border-gray-200 bg-gray-50 rounded-md shadow-sm p-2 text-gray-500 cursor-not-allowed" />
                            </label>
                        </div>
                    </div>
                    {/* Other Edit Fields Grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t border-gray-100">
                        <label className="col-span-1">
                            <span className="font-light text-gray-700 text-lg block mb-1">Pick-up Time</span>
                            <input type="text" name="pickupTime" value={pickupTime} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors p-2 text-gray-700" />
                        </label>
                        <div className="flex flex-col">
                            <p className="font-light text-gray-700 text-lg">Client</p>
                            <p className="mt-1 text-gray-700">{rideDetails.customer?.name}</p>
                        </div>
                        <label className="col-span-1">
                            <span className="font-light text-gray-700 text-lg block mb-1">Drive Time</span>
                            <input type="text" name="driveTimeAB" value={driveTimeAB} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors p-2 text-gray-700" />
                        </label>
                        <label className="col-span-1">
                            <span className="font-light text-gray-700 text-lg block mb-1">Total Mileage</span>
                            <input type="text" name="mileage" value={mileage} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors p-2 text-gray-700" />
                        </label>
                        <div className="flex flex-col col-span-2">
                            <p className="font-light text-gray-700 text-lg">Notes</p>
                            <textarea name="notes" value={notes} onChange={handleInputChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition-colors p-2 text-gray-700"></textarea>
                        </div>
                    </div>
                    {/* Edit Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button className="flex-grow px-5 py-3 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition-colors" onClick={handleSaveClick}>Save</button>
                        <button className="flex-grow px-5 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-lg hover:bg-gray-300 transition-colors" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
        
        {/* Footer/Action Buttons - Removed Status Bars */}
        <div className="pt-4 mt-auto">
            {/* Action Buttons */}
            {!isEditing && (
                <div className="flex gap-4">
                    {(rideDetails.status === 'AVAILABLE' || rideDetails.status === 'Added' || rideDetails.status === 'Unreserved') ? (
                        <>
                            <button className="flex-grow px-5 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors" onClick={handleAcceptRide}>Accept?</button>
                        </>
                    ) : rideDetails.status === 'Reserved' ? (
                        <>
                            <button className="flex-grow px-5 py-3 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-300 transition-colors" onClick={handleUnreserveRide}>Unreserve</button>
                            <button className="flex-grow px-5 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors" onClick={handleOpenTimeModal}>Completed</button> 
                        </>
                    ) : null}
                </div>
            )}
        </div>
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
      
      {/* 3. Pass the current LOGGED totalTime when editing, or estimated time when completing */}
      <TotalTimeModal
        isOpen={isTimeModalOpen}
        onClose={handleCloseTimeModal}
        onSave={handleSaveCompletion} 
        // Logic: If opening for the first time (totalTime is empty), use driveTimeAB. 
        // If opening to edit (totalTime is set), use totalTime.
        initialDriveTime={totalTime || driveTimeAB} 
      />
      
    </div>
  );
}