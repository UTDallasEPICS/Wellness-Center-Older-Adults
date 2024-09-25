"use client";
import React, { useState } from "react";
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import AddRidesTable from "/app/components/AddRidesTable.jsx";
import ReservedRidesTable from "/app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "/app/components/CompletedRidesTable.jsx";
import AddRideForm from "/app/components/AddRideForm.jsx";
import data from "/app/mock-data.json";
import AddRidePositive from "/app/components/AddRidePositive.jsx";
import AddRideNeg from "/app/components/AddRideNeg.jsx";
import { nanoid } from "nanoid";

export default function Page() {
  const [ridesData, setRidesData] = useState(data);

  const [addFormData, setAddFormData] = useState({
    clientName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
  });

  const [notification, setNotification] = useState(null);

  const handleAddFormChange = (event) => {
    if (event.preventDefault) {
      event.preventDefault();
      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;
  
      const newFormData = { ...addFormData };
      newFormData[fieldName] = fieldValue;
  
      setAddFormData(newFormData);
    } else {
      const fieldName = "startTime";
      const fieldValue = event;
  
      const newFormData = { ...addFormData };
      newFormData[fieldName] = fieldValue;
  
      setAddFormData(newFormData);
    }
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    // Form Validation: Check if all fields are filled
    if (
      addFormData.clientName.trim() === "" ||
      addFormData.phoneNumber.trim() === "" ||
      addFormData.address.trim() === "" ||
      addFormData.startTime.trim() === ""
    ) {
      // Trigger error notification if any field is empty
      setNotification(<AddRideNeg />);  // <-- Error notification

      // Hide error notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return;  // Stop execution if form is invalid
    }

    // If the form is valid, proceed with adding the ride
    const newContact = {
      id: nanoid(),
      clientName: addFormData.clientName,
      phoneNumber: addFormData.phoneNumber,
      address: addFormData.address,
      startTime: addFormData.startTime,
      status: "Added",
      volunteerName: "",
      hours: 0,
    };

    const newContacts = [...ridesData, newContact];
    setRidesData(newContacts);

    // Reset form data
    setAddFormData({
      clientName: "",
      phoneNumber: "",
      address: "",
      startTime: "",
    });

    // Show success notification
    setNotification(<AddRidePositive />);  // <-- Success notification

    // Hide success notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const tabs = [
    {
      aKey: "added",
      title: "Added",
      content: <AddRidesTable initialContacts={ridesData} />,
    },
    {
      aKey: "reserved",
      title: "Reserved",
      content: <ReservedRidesTable initialContacts={ridesData} />,
    },
    {
      aKey: "completed",
      title: "Completed",
      content: <CompletedRidesTable initialContacts={ridesData} />,
    },
  ];

  return (
    <div className="h-full w-full bg-white">
       {notification && (
        <div className="absolute top-4 right-4">
          {notification}
        </div>
      )}


      <AddRideForm
        addFormData={addFormData}
        handleAddFormSubmit={handleAddFormSubmit}
        handleAddFormChange={handleAddFormChange}
      />
      <SimpleTab activeKey="added">
        {tabs.map((item) => (
          <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
            {React.cloneElement(item.content, { initialContacts: ridesData })}
          </Tab>
        ))}
      </SimpleTab>
    </div>
  );
}
