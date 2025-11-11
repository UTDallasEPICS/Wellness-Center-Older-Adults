"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import RideMap from "../../components/RideMap";
import { Search, Plus } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRides, setSelectedRides] = useState([]);

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

  const handleToggleRideSelection = (rideId) => {
    setSelectedRides((prevSelected) => {
      if (prevSelected.includes(rideId)) {
        return prevSelected.filter((id) => id !== rideId);
      } else {
        return [...prevSelected, rideId];
      }
    });
  };

  const handleToggleAllRides = (currentTableRides, isChecked) => {
    if (isChecked) {
      const allIds = currentTableRides.map((ride) => ride.id);
      setSelectedRides(allIds);
    } else {
      setSelectedRides([]);
    }
  };

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rides");
      if (!response.ok) {
        throw new Error(`Failed to fetch rides: ${response.status}`);
      }
      const rawData = await response.json();

      const formattedData = rawData.map((ride) => ({
        id: ride.id,
        customerID: ride.customerID,
        customerName: ride.customerName,
        customerPhone: ride.customerPhone,
        phoneNumber: ride.customerPhone,
        startAddressID: ride.startAddressID,
        endAddressID: ride.endAddressID,
        startLocation: ride.startLocation,
        endLocation: ride.endLocation,
        startAddress: ride.startAddress,
        volunteerName: ride.volunteerName,
        date: ride.date,
        startTime: ride.startTime,
        status: ride.status || "Unreserved",
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
      const response = await fetch("/api/rides");
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
      const response = await fetch(`/api/rides/${id}`);
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
    const tabFromQuery = searchParams.get("tab");
    if (
      tabFromQuery &&
      ["available", "reserved", "completed"].includes(tabFromQuery)
    ) {
      setActiveTab(tabFromQuery);
    }
    fetchRides();
    fetchCustomers();
    fetchAddresses();
    if (rideIdFromParams) {
      fetchRideDetails(rideIdFromParams);
    }
  }, [searchParams, rideIdFromParams]);

  const handleReserveClick = async (rideId) => {
    try {
      // ALREADY CORRECT: Uses /api/rides/${id}
      const response = await fetch(`/api/rides/${rideId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Reserved" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to reserve ride: ${response.status} - ${errorData?.message || "Unknown error"}`
        );
      }

      toast.success("Ride reserved successfully!");

      setActiveTab("reserved");
      router.push("/Dashboard/rides-volunteer?tab=reserved", undefined, {
        shallow: true,
      });
      await fetchRides();
    } catch (error) {
      console.error("Error reserving ride:", error);
      toast.error(`Failed to reserve ride: ${error.message}`);
    }
  };

  function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    let formattedHours = parseInt(hours, 10);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const ampm = formattedHours >= 12 ? "PM" : "AM";
    formattedHours = formattedHours % 12;
    formattedHours = formattedHours ? formattedHours : 12;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const handleAcceptRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Reserved" }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update ride status: ${response.status}`);
        }
        toast.success("Ride reserved successfully!");
        setRideDetails({ ...rideDetails, status: "Reserved" });
        router.push("/Dashboard/rides-volunteer?tab=reserved");
      } catch (err) {
        console.error("Error updating ride status:", err);
        toast.error("Failed to reserve ride.");
      }
    }
  };

  const handleCompleteRide = async () => {
    if (rideDetails) {
      try {
        const response = await fetch(`/api/rides/${rideDetails.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Completed" }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to update ride status: ${response.status} - ${errorData?.error || "Unknown error"}`
          );
        }
        toast.success("Ride completed successfully!");
        setRideDetails({ ...rideDetails, status: "Completed" });
        router.push("/Dashboard/rides-volunteer?tab=completed");
      } catch (err) {
        console.error("Error updating ride status to Completed:", err);
        toast.error("Failed to mark ride as completed.");
      }
    }
  };

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

  const filterRides = (statusFilter) => {
    return ridesData.filter((ride) => {
      const statusMatch = Array.isArray(statusFilter)
        ? statusFilter.includes(ride.status)
        : ride.status === statusFilter;

      if (!statusMatch) return false;

      if (searchTerm.trim() === "") return true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      return (
        (ride.customerName &&
          ride.customerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ride.startLocation &&
          ride.startLocation.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ride.volunteerName &&
          ride.volunteerName.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });
  };

  const availableRides = filterRides(["Added", "Unreserved", "AVAILABLE"]);
  const reservedRides = filterRides("Reserved");
  const completedRides = filterRides("Completed");

  const tabs = [
    {
      aKey: "available",
      title: `Unreserved (${availableRides.length})`,
      content: (
        <AddRidesTable
          initialContacts={availableRides}
          convertTime={convertTo12Hour}
          handleReserveClick={handleReserveClick}
          customers={customers}
          addresses={addresses}
          selectedRides={selectedRides}
          onToggleSelect={handleToggleRideSelection}
          onToggleAll={handleToggleAllRides}
        />
      ),
    },
    {
      aKey: "reserved",
      title: `Reserved (${reservedRides.length})`,
      content: (
        <ReservedRidesTable
          initialContacts={reservedRides}
          convertTime={convertTo12Hour}
          selectedRides={selectedRides}
          onToggleSelect={handleToggleRideSelection}
          onToggleAll={handleToggleAllRides}
          isVolunteer={true}
        />
      ),
    },
    {
      aKey: "completed",
      title: `Completed (${completedRides.length})`,
      content: (
        <CompletedRidesTable
          initialContacts={completedRides}
          convertTime={convertTo12Hour}
          selectedRides={selectedRides}
          onToggleSelect={handleToggleRideSelection}
          onToggleAll={handleToggleAllRides}
        />
      ),
    },
  ];

  return (
    <div className="h-full w-full p-10 bg-[#f4f4f4] flex justify-center">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-light text-gray-800">Rides</h1>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by Client, Location, or Volunteer..."
              className="w-full py-3.5 pl-12 pr-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#419902]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            type="button"
            className="py-3 px-8 text-lg font-semibold rounded-lg text-white bg-[#419902] hover:bg-[#378300] transition-colors shadow-md"
            onClick={() => {}}
          >
            Search
          </button>
        </div>

        <SimpleTab
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            router.push(`/Dashboard/rides-volunteer?tab=${key}`, undefined, {
              shallow: true,
            });
          }}
          tabClassName="text-xl font-semibold px-4 py-2"
          activeTabClassName="text-[#419902] border-b-4 border-[#419902]"
          inactiveTabClassName="text-gray-500 hover:text-[#419902]/80 transition-colors"
        >
          {tabs.map((item) => (
            <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
              <div className="mt-4">{item.content}</div>
            </Tab>
          ))}
        </SimpleTab>
      </div>
      {notification && (
        <div className="absolute top-4 right-4 z-50">{notification}</div>
      )}
    </div>
  );
}