// ride/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [ridesData, setRidesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabsData, setTabsData] = useState([
    { aKey: "available", title: "Available Rides", content: null },
    { aKey: "reserved", title: "Reserved Rides", content: null },
    { aKey: "completed", title: "Completed Rides", content: null },
  ]);
  const [newTabIndex, setNewTabIndex] = useState(0);

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
    return `<span class="math-inline">\{hours12\}\:</span>{minutes} ${ampm}`;
  };

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/getAvailableRides");
      if (!response.ok) {
        throw new Error(`Failed to fetch rides: ${response.status}`);
      }
      const data = await response.json();
      // Format the data to match the expected structure of AddRidesTable
      const formattedData = data.map(ride => ({
        id: ride.id, // Assuming your API returns an ID
        customerID: ride.customer?.id, // Adjust based on your actual data structure
        customerName: `${ride.customer?.firstName} ${ride.customer?.lastName}`,
        customerPhone: ride.customer?.customerPhone,
        startAddressID: ride.addrStart?.id, // Adjust based on your data structure
        startLocation: `${ride.addrStart?.street}, ${ride.addrStart?.city}, ${ride.addrStart?.state} ${ride.addrStart?.postalCode}`,
        endLocation: `${ride.addrEnd?.street}, ${ride.addrEnd?.city}, ${ride.addrEnd?.state} ${ride.addrEnd?.postalCode}`,
        date: ride.date,
        pickupTime: ride.startTime,
        status: ride.status || "Unreserved", // Default status
      }));
      setRidesData(formattedData);
    } catch (error) {
      setError(error.message);
      toast.error(
        "Failed to load rides. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleAddRide = async (newRideData) => {
    try {
      const response = await fetch("/api/createRide", { // Use your ride creation API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRideData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add ride: ${response.status} - ${errorData?.message || 'Unknown error'}`);
      }
      toast.success("Ride added successfully!");
      fetchRides(); // Re-fetch to update the UI
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding ride:", error);
      toast.error(`Failed to add ride: ${error.message}`);
    }
  };

  const handleEditRide = async (updatedRideData) => {
    try {
      const response = await fetch(`/api/rides/${updatedRideData.id}`, { // Create an API endpoint for updating rides
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRideData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update ride: ${response.status} - ${errorData?.message || 'Unknown error'}`);
      }
      toast.success("Ride updated successfully!");
      fetchRides(); // Re-fetch to update the UI
    } catch (error) {
      console.error("Error updating ride:", error);
      toast.error(`Failed to update ride: ${error.message}`);
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (window.confirm("Are you sure you want to delete this ride?")) {
      try {
        const response = await fetch(`/api/rides/${rideId}`, { // Create an API endpoint for deleting rides
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete ride: ${response.status} - ${errorData?.message || 'Unknown error'}`);
        }
        toast.success("Ride deleted successfully!");
        fetchRides(); // Re-fetch to update the UI
      } catch (error) {
        console.error("Error deleting ride:", error);
        toast.error(`Failed to delete ride: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    setTabsData([
      {
        aKey: "available",
        title: "Available Rides",
        content: (
          <AddRidesTable // Now passing the callback props
            initialContacts={ridesData.filter(
              (ride) => ride.status === "Added" || ride.status === "Unreserved" // Adjust filter as needed
            )}
            convertTime={convertTo12Hour}
            onAddRide={handleAddRide}
            onEditRide={handleEditRide}
            onDeleteRide={handleDeleteRide}
          />
        ),
      },
      {
        aKey: "reserved",
        title: "Reserved Rides",
        content: (
          <ReservedRidesTable
            initialContacts={ridesData.filter((ride) => ride.status === "Reserved")}
            convertTime={convertTo12Hour}
          />
        ),
      },
      {
        aKey: "completed",
        title: "Completed Rides",
        content: (
          <CompletedRidesTable
            initialContacts={ridesData.filter((ride) => ride.status === "Completed")}
            convertTime={convertTo12Hour}
          />
        ),
      },
    ]);
  }, [ridesData, convertTo12Hour, handleAddRide, handleEditRide, handleDeleteRide]);

  const handleAddFormSubmit = (newRide) => {
    // This function is now primarily for the AddRideForm modal
    handleAddRide(newRide);
  };

  const handleAddTab = () => {
    const newTabKey = `newTab${newTabIndex}`;
    setTabsData((prevTabs) => [
      ...prevTabs,
      { aKey: newTabKey, title: `New Tab ${newTabIndex + 1}`, content: <div>Content for new tab</div> },
    ]);
    setNewTabIndex((prevIndex) => prevIndex + 1);
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

  return (
    <div className="h-full w-full bg-white relative">
      <button
        type="button"
        className="h-[45px] w-[45px] rounded-full text-white bg-black border-none absolute top-[calc(10px-48px)] right-4 z-40 flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      ><span className="material-symbols-rounded">add</span>
      </button>

      <AddRideForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleAddFormSubmit={handleAddFormSubmit}
      />

      <SimpleTab activeKey="available" onTabAdd={handleAddTab}>
        {tabsData.map((item) => (
          <div key={item.aKey} aKey={item.aKey} title={item.title}>
            {item.content}
          </div>
        ))}
      </SimpleTab>
    </div>
  );
}