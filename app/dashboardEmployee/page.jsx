// page.jsx
"use client";
import React, { useState } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import newMockData from "/app/mockdata/mock-data-new";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
    const [ridesData, setRidesData] = useState(newMockData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddFormSubmit = async (formData) => {
        if (
            !formData.customerName?.trim() ||
            !formData.pickupStreet?.trim() ||
            !formData.destinationStreet?.trim() ||
            !formData.pickUpTime?.trim() ||
            !formData.date?.trim()
        ) {
            toast.error("Please fill in all required fields.");
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
                throw new Error(`HTTP error! status: ${reply.status}`);
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

            toast.success("Ride added successfully!");
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error adding ride:", error);
            toast.error("Failed to add ride. Please try again.");
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