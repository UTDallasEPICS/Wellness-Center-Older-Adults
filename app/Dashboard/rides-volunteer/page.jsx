// /app/Dashboard/rides/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import DashboardLayout from "../layout";
import AddRideForm from "/app/components/AddRideForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import RideMap from '../../components/RideMap';
import { Search, Plus } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRides, setSelectedRides] = useState([]);

    const convertTo12Hour = (time24) => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":");
        let hours12 = parseInt(hours, 10);
        const ampm = hours12 >= 12 ? "PM" : "AM";
        if (hours12 > 12) hours12 -= 12;
        else if (hours12 === 0) hours12 = 12;
        return `${hours12}:${minutes} ${ampm}`;
    };

    const handleToggleRideSelection = (rideId) => {
        setSelectedRides(prevSelected => prevSelected.includes(rideId) 
            ? prevSelected.filter(id => id !== rideId) 
            : [...prevSelected, rideId]
        );
    };

    const handleToggleAllRides = (currentTableRides, isChecked) => {
        setSelectedRides(isChecked ? currentTableRides.map(r => r.id) : []);
    };

    const fetchRides = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/getAvailableRides");
            if (!response.ok) throw new Error(`Failed to fetch rides: ${response.status}`);
            const rawData = await response.json();
            const formattedData = rawData.map((ride) => ({
                id: ride.id,
                customerID: ride.customerID,
                customerName: ride.customerName,
                customerPhone: ride.customerPhone,
                startAddressID: ride.startAddressID,
                endAddressID: ride.endAddressID,
                startLocation: ride.startLocation,
                endLocation: ride.endLocation,
                startAddress: ride.startAddress,
                endAddress: ride.endAddress,
                volunteerName: ride.volunteerName,
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
            if (response.ok) setCustomers(await response.json());
        } catch (error) { console.error("Error fetching customers:", error); }
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/getAvailableRides"); 
            if (response.ok) setAddresses(await response.json());
        } catch (error) { console.error("Error fetching addresses:", error); }
    };

    const fetchRideDetails = async (id) => {
        try {
            const response = await fetch(`/api/ride/get/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch ride details: ${response.status}`);
            setRideDetails(await response.json());
        } catch (err) { setError(err.message); }
    };

    useEffect(() => {
        const tabFromQuery = searchParams.get('tab');
        if (tabFromQuery && ['available', 'reserved', 'completed'].includes(tabFromQuery)) {
            setActiveTab(tabFromQuery);
        }
        fetchRides();
        fetchCustomers();
        fetchAddresses();
        if (rideIdFromParams) fetchRideDetails(rideIdFromParams);
    }, [searchParams, rideIdFromParams]);

    const handleAddRide = async (newRideData) => {
        try {
            const response = await fetch('/api/createRide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRideData),
            });
            if (!response.ok) throw new Error(`Failed to add ride: ${response.status}`);
            toast.success("Ride added successfully!");
            setIsModalOpen(false);
            await fetchRides();
        } catch (error) { toast.error(`Failed to add ride: ${error.message}`); }
    };

    const handleEditRide = async (updatedRideData) => {
        try {
            const response = await fetch(`/api/rides/${updatedRideData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRideData),
            });
            if (!response.ok) throw new Error(`Failed to update ride: ${response.status}`);
            toast.success("Ride updated successfully!");
            await fetchRides();
        } catch (error) { toast.error(`Failed to update ride: ${error.message}`); }
    };

    const handleDeleteRide = async (rideId) => {
        if (window.confirm("Are you sure you want to delete this ride?")) {
            try {
                const response = await fetch(`/api/deleteRides/${rideId}`, { method: "DELETE" });
                if (!response.ok) throw new Error(`Failed to delete ride: ${response.status}`);
                toast.success("Ride deleted successfully!");
                setRidesData(prev => prev.filter(r => r.id !== rideId));
                setSelectedRides(prev => prev.filter(id => id !== rideId));
            } catch (error) { toast.error(`Failed to delete ride: ${error.message}`); }
        }
    };

    const handleReserveClick = async (rideId) => {
        try {
            const response = await fetch(`/api/rides/reserve/${rideId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Reserved' }),
            });
            if (!response.ok) throw new Error(`Failed to reserve ride: ${response.status}`);
            toast.success("Ride reserved successfully!");
            setActiveTab('reserved');
            router.push('/Dashboard/rides?tab=reserved', undefined, { shallow: true });
            await fetchRides();
        } catch (error) { toast.error(`Failed to reserve ride: ${error.message}`); }
    };

    const filterRides = (statusFilter) => {
        return ridesData.filter(ride => {
            const statusMatch = Array.isArray(statusFilter) ? statusFilter.includes(ride.status) : ride.status === statusFilter;
            if (!statusMatch) return false;
            if (!searchTerm.trim()) return true;
            const lower = searchTerm.toLowerCase();
            return (ride.customerName?.toLowerCase().includes(lower) ||
                    ride.startLocation?.toLowerCase().includes(lower) ||
                    ride.volunteerName?.toLowerCase().includes(lower));
        });
    };

    const availableRides = filterRides(["Added", "Unreserved", "AVAILABLE"]);
    const reservedRides = filterRides("Reserved");
    const completedRides = filterRides("Completed");

    const tabs = [
        { aKey: "available", title: `Unreserved (${availableRides.length})`, content: <AddRidesTable initialContacts={availableRides} convertTime={convertTo12Hour} onEditRide={handleEditRide} onDeleteRide={handleDeleteRide} handleReserveClick={handleReserveClick} customers={customers} addresses={addresses} selectedRides={selectedRides} onToggleSelect={handleToggleRideSelection} onToggleAll={handleToggleAllRides} /> },
        { aKey: "reserved", title: `Reserved (${reservedRides.length})`, content: <ReservedRidesTable initialContacts={reservedRides} convertTime={convertTo12Hour} onRideDeleted={handleDeleteRide} onRideUpdated={handleEditRide} selectedRides={selectedRides} onToggleSelect={handleToggleRideSelection} onToggleAll={handleToggleAllRides} /> },
        { aKey: "completed", title: `Completed (${completedRides.length})`, content: <CompletedRidesTable initialContacts={completedRides} convertTime={convertTo12Hour} onDeleteRide={handleDeleteRide} selectedRides={selectedRides} onToggleSelect={handleToggleRideSelection} onToggleAll={handleToggleAllRides} /> },
    ];

    if (loading && !rideIdFromParams) return <div className="flex items-center justify-center h-screen"><p>Loading rides...</p></div>;
    if (error) return <div className="flex items-center justify-center h-screen text-red-500"><p>Error: {error}</p></div>;

    return (
        <DashboardLayout>
            <div className="h-full w-full p-10 bg-[#f4f4f4] flex justify-center">
                <div className="max-w-6xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-light text-gray-800">Rides</h1>
                        <button type="button" className="h-12 w-12 rounded-full text-white bg-[#419902] hover:bg-[#378300] transition-colors flex items-center justify-center shadow-lg" onClick={() => setIsModalOpen(true)}>
                            <Plus size={28} />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="relative flex-grow">
                            <input type="text" placeholder="Search by Client, Location, or Volunteer..." className="w-full py-3.5 pl-12 pr-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#419902]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <button type="button" className="py-3 px-8 text-lg font-semibold rounded-lg text-white bg-[#419902] hover:bg-[#378300] transition-colors shadow-md">Search</button>
                    </div>

                    <SimpleTab activeKey={activeTab} onChange={(key) => { setActiveTab(key); router.push(`/Dashboard/rides?tab=${key}`, undefined, { shallow: true }); }} tabClassName="text-xl font-semibold px-4 py-2" activeTabClassName="text-[#419902] border-b-4 border-[#419902]" inactiveTabClassName="text-gray-500 hover:text-[#419902]/80 transition-colors">
                        {tabs.map(item => <Tab key={item.aKey} aKey={item.aKey} title={item.title}><div className="mt-4">{item.content}</div></Tab>)}
                    </SimpleTab>
                </div>
                <AddRideForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} handleAddFormSubmit={handleAddFormSubmit} />
                {notification && <div className="absolute top-4 right-4 z-50">{notification}</div>}
            </div>
        </DashboardLayout>
    );
}
