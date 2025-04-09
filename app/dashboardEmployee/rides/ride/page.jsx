// page.jsx
"use client";
import React, { useState } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import newMockData from "/app/mockdata/mock-data-new";
import AddRidePositive from "/app/components/AddRidePositive.jsx";
import AddRideNeg from "/app/components/AddRideNeg.jsx";

export default function Page() {
    const [ridesData, setRidesData] = useState(newMockData);
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddFormSubmit = async (formData) => {
        if (
            !formData.customerName?.trim() ||
            !formData.pickupStreet?.trim() ||
            !formData.destinationStreet?.trim() ||
            !formData.pickUpTime?.trim() ||
            !formData.date?.trim()
        ) {
            setNotification(<AddRideNeg />);
            setTimeout(() => {
                setNotification(null);
            }, 3000);
            return;
        }

        try {
            const reply = await fetch("/api/createRide", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: formData.customerName,
                    pickupStreet: formData.pickupStreet,
                    pickupCity: formData.pickupCity,
                    pickupState: formData.pickupState,
                    pickupZip: formData.pickupZip,
                    destinationStreet: formData.destinationStreet,
                    destinationCity: formData.destinationCity,
                    destinationState: formData.destinationState,
                    destinationZip: formData.destinationZip,
                    pickUpTime: formData.pickUpTime,
                    date: formData.date,
                    ways: formData.ways,
                    extraInfo: formData.extraInfo,
                }),
            });
            if (!reply.ok) {
                const errorMessage = `HTTP error! status: ${reply.status}`;
                console.error(errorMessage);
                // Optionally set an error notification here if the API call failed
                setNotification(<AddRideNeg message={errorMessage} />);
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
                return;
            }

            const data = await reply.json();
            console.log("API Response:", data);

            // Update the local state with the new ride data
            const newRide = {
                customerName: formData.customerName,
                pickupStreet: formData.pickupStreet,
                pickupCity: formData.pickupCity,
                pickupState: formData.pickupState,
                pickupZip: formData.pickupZip,
                destinationStreet: formData.destinationStreet,
                destinationCity: formData.destinationCity,
                destinationState: formData.destinationState,
                destinationZip: formData.destinationZip,
                pickUpTime: formData.pickUpTime,
                date: formData.date,
                ways: formData.ways,
                extraInfo: formData.extraInfo,
                status: "Added",
                volunteerName: "",
                hours: 0,
                time: new Date().toLocaleTimeString(),
            };

            setRidesData([...ridesData, newRide]);

            setNotification(<AddRidePositive />);
            setTimeout(() => {
                setNotification(null);
            }, 3000);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding ride:", error);
            // Handle other potential errors during the fetch or JSON parsing
            setNotification(<AddRideNeg message="Failed to add ride due to a client-side error." />);
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
    };

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

    const tabs = [
        {
            aKey: "added",
            title: "Added/Unreserved",
            content: <AddRidesTable initialContacts={ridesData} convertTime={convertTo12Hour} />,
        },
        {
            aKey: "reserved",
            title: "Reserved",
            content: <ReservedRidesTable initialContacts={ridesData} convertTime={convertTo12Hour} />,
        },
        {
            aKey: "completed",
            title: "Completed",
            content: <CompletedRidesTable initialContacts={ridesData} convertTime={convertTo12Hour} />,
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

            <SimpleTab activeKey="added">
                {tabs.map((item) => (
                    <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
                        {item.content}
                    </Tab>
                ))}
            </SimpleTab>
        </div>
    );
}