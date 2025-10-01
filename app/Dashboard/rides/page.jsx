"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import RideMap from '../../components/RideMap';

export default function Page() {
    const { id: rideIdFromParams } = useParams();
    const router = useRouter();
    const [rideDetails, setRideDetails] = useState(null);
    const [ridesData, setRidesData] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('available');

    const convertTo12Hour = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        let hours12 = parseInt(hours, 10);
        const ampm = hours12 >= 12 ? "PM" : "AM";
        if (hours12 > 12) {
            hours12 -= 12;
        } else if (hours12 === 0) {
            hours12 = 12;
        }
        return `${hours12}:${minutes} ${ampm}`;
    };

const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch("/api/getAvailableRides");
        if (!response.ok) {
            throw new Error(`Failed to fetch rides: ${response.status}`);
        }
        const rawData = await response.json();

        const formattedData = rawData.map((ride) => ({
            id: ride.id,
            customerID: ride.customerID,
            customerName: ride.customerName,
            customerPhone: ride.customerPhone, // Updated field name
            phoneNumber: ride.customerPhone, // Keep for backward compatibility
            startAddressID: ride.startAddressID,
            endAddressID: ride.endAddressID,
            startLocation: ride.startLocation,
            endLocation: ride.endLocation,
            date: ride.date,
            startTime: ride.startTime,
            status: ride.status || "Unreserved",
        }));
        setRidesData(formattedData);
    } catch (error) {
        setError(error.message);
        toast.error("Failed to load rides. Please check your network connection.");
    } finally {
        setLoading(false);
    }
};

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customer/getCustomer");
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/addresses");
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const fetchRideDetails = async (id) => {
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

    useEffect(() => {
        const tabFromQuery = searchParams.get('tab');
        if (tabFromQuery && ['available', 'reserved', 'completed'].includes(tabFromQuery)) {
            setActiveTab(tabFromQuery);
        }
        fetchRides();
        fetchCustomers();
        fetchAddresses();
        if (rideIdFromParams) {
            fetchRideDetails(rideIdFromParams);
        }
    }, [searchParams, rideIdFromParams]); // Re-run effect when query parameters or rideId changes

    const handleAddRide = async (newRideData) => {
        try {
            const response = await fetch('/api/createRide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRideData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to add ride: ${response.status} - ${errorData?.message || 'Unknown error'}`);
            }

            toast.success("Ride added successfully!");
            setIsModalOpen(false); // Close the modal
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error("Error adding ride:", error);
            toast.error(`Failed to add ride: ${error.message}`);
        }
    };

const handleEditRide = async (updatedRideData) => {
    try {
        const rideResponse = await fetch(`/api/rides/${updatedRideData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerID: updatedRideData.customerID,
                date: updatedRideData.date,
                pickupTime: updatedRideData.pickupTime,
                startAddressID: updatedRideData.startAddressID,
                endAddressID: updatedRideData.endAddressID,
                volunteerID: updatedRideData.volunteerID,
                status: updatedRideData.status,
                // Include the updates data for customer and address
                customerUpdates: updatedRideData.customerUpdates,
                addressUpdates: updatedRideData.addressUpdates,
                volunteerUpdates: updatedRideData.volunteerUpdates
            }),
        });
        if (!rideResponse.ok) {
            const errorData = await rideResponse.json();
            throw new Error(
                `Failed to update ride: ${rideResponse.status} - ${
                    errorData?.message || "Unknown error"
                }`
            );
        }

        const responseData = await rideResponse.json();
        console.log("=== RIDE UPDATE RESPONSE ===");
        console.log("Response data:", responseData);

        // Update local state immediately with the response data
        if (responseData.formattedData) {
            setRidesData(currentRides => 
                currentRides.map(ride => 
                    ride.id === updatedRideData.id 
                        ? { ...ride, ...responseData.formattedData }
                        : ride
                )
            );
        }

        toast.success("Ride updated successfully!");
        await fetchRides();
        if (rideDetails?.id === updatedRideData.id) {
            await fetchRideDetails(updatedRideData.id);
        }

    } catch (error) {
        console.error("Error updating ride:", error);
        toast.error(`Failed to update ride: ${error.message}`);
    }
};

    const handleDeleteRide = async (rideId) => {
        if (window.confirm("Are you sure you want to delete this ride?")) {
            try {
                const response = await fetch(`/api/deleteRides/${rideId}`, { // Corrected delete route
                    method: "DELETE",
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        `Failed to delete ride: ${response.status} - ${
                            errorData?.message || "Unknown error"
                        }`
                    );
                }
                toast.success("Ride deleted successfully!");
                fetchRides();
                if (rideDetails?.id === rideId) {
                    setRideDetails(null); // Clear details view if it was the deleted ride
                }
                window.location.reload(); // Reload the page after successful delete
            } catch (error) {
                console.error("Error deleting ride:", error);
                toast.error(`Failed to delete ride: ${error.message}`);
            }
        }
    };

    const handleAddFormSubmit = (formData) => {
        setIsModalOpen(false);
        window.location.reload();
    };

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

    let actionButton;
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

    if (rideDetails?.status === 'Reserved') {
        actionButton = (
            <button
                className="px-5 py-2 bg-green-500 hover:bg-green-700 text-white rounded"
                onClick={handleCompleteRide}
            >
                Completed
            </button>
        );
    } else if (rideDetails?.status === 'Completed') {
        actionButton = null;
    }

    if (loading && !rideIdFromParams) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading rides...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (rideIdFromParams) {
        if (!rideDetails) {
            return <div className="animate-pulse">Loading ride details...</div>;
        }
        return (
            <div className="flex h-screen">
                <div className="w-1/2 p-5 ride-details-container">
                    <div className="flex justify-between mb-5">
                        <h2 className="text-2xl font-bold">Ride #{rideDetails.id}</h2>
                        {console.log("rideDetails.date:", rideDetails.date)}
                        <p className="m-0">
                            Date: {rideDetails.date ? new Date(rideDetails.date).toLocaleDateString() : 'Date not available'}
                        </p>
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
                        <p className="m-0"><strong>Drive Time</strong><br />A-B: {rideDetails.driveTimeAB}</p>
                    </div>

                    <div className="flex justify-between mb-5">
                        <p className="m-0"><strong>Total Mileage</strong><br />{rideDetails.mileage}</p>
                        <p className="m-0"><strong>Wait Time</strong><br />{rideDetails.waitTime || 'N/A'}</p>
                    </div>

                    <div className="flex justify-between mb-5">
                        {actionButton}
                        <p className="m-0"><strong>Notes</strong><br />N/A</p>
                    </div>
                </div>
                <div className="w-1/2 h-screen">
                    {console.log({ rideDetails: rideDetails?.pickupAddress })}
                    {rideDetails?.pickupAddress && rideDetails?.dropoffAddress && (
                        <RideMap
                            pickupAddress={rideDetails.pickupAddress}
                            dropoffAddress={rideDetails.dropoffAddress}
                            finalAddress={rideDetails.dropoffAddress}
                        />
                    )}
                </div>
            </div>
        );
    }

    const tabs = [
        {
            aKey: "available",
            title: "Added/Unreserved",
            content: (
                <AddRidesTable
                    initialContacts={ridesData.filter(
                        (ride) =>
                            ride.status === "Added" ||
                            ride.status === "Unreserved" ||
                            ride.status === "AVAILABLE"
                    )}
                    convertTime={convertTo12Hour}
                    onEditRide={handleEditRide}
                    onDeleteRide={handleDeleteRide} // Passing the delete handler
                    customers={customers}
                    addresses={addresses}
                />
            ),
        },
        {
            aKey: "reserved",
            title: "Reserved",
            content: (
                <ReservedRidesTable
                    initialContacts={ridesData.filter((ride) => ride.status === "Reserved")}
                    convertTime={convertTo12Hour}
                    onRideDeleted={handleDeleteRide} // Passing the delete handler
                    onRideUpdated={handleEditRide} // Assuming you want to edit from this table too
                />
            ),
        },
        {
            aKey: "completed",
            title: "Completed",
            content: (
                <CompletedRidesTable
                    initialContacts={ridesData.filter((ride) => ride.status === "Completed")}
                    convertTime={convertTo12Hour}
                    onDeleteRide={handleDeleteRide}
                />
            ),
        },
    ];

    return (
        <div className="h-full w-full bg-[#f4f1f0] relative">
            <style jsx>
                {`
                    .main-container {
                        font-family: sans-serif;
                    }
                `}
            </style>
            {notification && (
                <div className="absolute top-4 right-4 z-50">{notification}</div>
            )}

            <button
                type="button"
                className="h-[45px] w-[45px] rounded-full text-white bg-[#419902] hover: bg-[#378300] border-none absolute top-[calc(10px-48px)] right-4 z-40 flex items-center justify-center"
                onClick={() => setIsModalOpen(true)}
            >
                <span className="material-symbols-rounded">add</span>
            </button>

            <AddRideForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handleAddFormSubmit={handleAddFormSubmit}
            />

            <SimpleTab activeKey={activeTab}>
                {tabs.map((item) => (
                    <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
                        {item.content}
                    </Tab>
                ))}
            </SimpleTab>
        </div>
    );
}