"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddRidePositive from "/app/components/AddRidePositive.jsx";
import AddRideNeg from "/app/components/AddRideNeg.jsx";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams(); // Get access to URL query parameters
  const [activeTab, setActiveTab] = useState('available'); // Default active tab

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
      console.log("Raw API Data:", rawData);

      const formattedData = rawData.map((ride) => {
        console.log("Raw ride object:", ride); // Debugging line
        return {
          id: ride.id,
          customerID: ride.customer?.id,
          customerName: `${ride.customer?.firstName || ""} ${
            ride.customer?.lastName || ""
          }`.trim(),
          customerPhone: ride.customer?.customerPhone || "",
          startAddressID: ride.addrStart?.id,
          startLocation: `${ride.addrStart?.street || ""}, ${
            ride.addrStart?.city || ""
          }, ${ride.addrStart?.state || ""} ${
            ride.addrStart?.postalCode || ""
          }`
            .replace(/,\s*,/, ",")
            .replace(/^,|,$/g, ""),
          endLocation: `${ride.addrEnd?.street || ""}, ${
            ride.addrEnd?.city || ""
          }, ${ride.addrEnd?.state || ""} ${ride.addrEnd?.postalCode || ""}`
            .replace(/,\s*,/, ",")
            .replace(/^,|,$/g, ""),
          date: ride.date,
          pickupTime: ride.startTime,
          status: ride.status || "Unreserved",
        };
      });
      console.log("Formatted Data:", formattedData);
      setRidesData(formattedData);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load rides. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && ['available', 'reserved', 'completed'].includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
    fetchRides();
  }, [searchParams]); // Re-run effect when query parameters change

  const handleAddRide = async (newRideData) => {
    if (
      !newRideData.customerName?.trim() ||
      !newRideData.pickupStreet?.trim() ||
      !newRideData.destinationStreet?.trim() ||
      !newRideData.pickUpTime?.trim() ||
      !newRideData.date?.trim()
    ) {
      setNotification(<AddRideNeg />);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }

    try {
      const response = await fetch("/api/createRide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRideData),
      });
      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        console.error(errorMessage);
        setNotification(<AddRideNeg message={errorMessage} />);
        setTimeout(() => {
          setNotification(null);
        }, 3000);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data);
      fetchRides(); // Re-fetch rides to update the UI
      setNotification(<AddRidePositive />);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding ride:", error);
      setNotification(
        <AddRideNeg message="Failed to add ride due to a client-side error." />
      );
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleEditRide = async (updatedRideData) => {
    try {
      const response = await fetch(`/api/rides/${updatedRideData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRideData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update ride: ${response.status} - ${
            errorData?.message || "Unknown error"
          }`
        );
      }
      toast.success("Ride updated successfully!");
      fetchRides();
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
      } catch (error) {
        console.error("Error deleting ride:", error);
        toast.error(`Failed to delete ride: ${error.message}`);
      }
    }
  };

  const handleAddFormSubmit = (formData) => {
    handleAddRide(formData);
  };

  if (loading) {
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
          // You might not want delete/edit on completed rides, adjust as needed
          onDeleteRide={handleDeleteRide}
        />
      ),
    },
  ];

  return (
    <div className="h-full w-full bg-white relative">
      {notification && (
        <div className="absolute top-4 right-4 z-50">{notification}</div>
      )}

      <button
        type="button"
        className="h-[45px] w-[45px] rounded-full text-white bg-black border-none absolute top-[calc(10px-48px)] right-4 z-40 flex items-center justify-center"
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