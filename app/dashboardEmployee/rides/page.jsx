"use client";
import React, { useState } from "react";
import SimpleTab, { Tab } from "app/components/SimpleTab.jsx";
import AddRidesTable from "app/components/AddRidesTable.jsx";
import ReservedRidesTable from "app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "app/components/CompletedRidesTable.jsx";
import AddRideForm from "app/components/AddRideForm.jsx";
import "app/styles/ridesPageEmployee.css";
import data from "app/mock-data.json";
import { nanoid } from "nanoid";

const tabs = [
  { aKey: "added", title: "Added", content: "Hi" },
  { aKey: "reserved", title: "Reserved", content: "Reserved" },
  { aKey: "completed", title: "Completed", content: "Bye" },
];

export default function Page() {
  const [ridesData, setRidesData] = useState(data);

  const [addFormData, setAddFormData] = useState({
    clientName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
  });

  const handleAddFormChange = (event) => {
    if (event.preventDefault) {
      event.preventDefault(); // Prevents default form submission (for input fields)
      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;
  
      const newFormData = { ...addFormData };
      newFormData[fieldName] = fieldValue;
  
      setAddFormData(newFormData);
    } else {
      // Handling direct value change (for time picker or other components)
      const fieldName = "startTime"; // Assuming this is the field name for the time picker
      const fieldValue = event; // 'event' is the new time value
  
      const newFormData = { ...addFormData };
      newFormData[fieldName] = fieldValue;
  
      setAddFormData(newFormData);
    }
  };
  

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

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
    setAddFormData({
      clientName: "",
      phoneNumber: "",
      address: "",
      startTime: "",
    });
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
    <div className=".ridesPageContainer">
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
