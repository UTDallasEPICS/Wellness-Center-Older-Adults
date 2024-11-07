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
import { nanoid } from "nanoid";
import { add } from "date-fns";

export default function Page() {
  const [ridesData, setRidesData] = useState(newMockData);

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



  const handleAddFormSubmit = async (event) => {

    event.preventDefault();

    
    if (
      addFormData.clientName.trim() === "" ||
      addFormData.phoneNumber.trim() === "" ||
      addFormData.address.trim() === "" ||
      addFormData.startTime.trim() === ""
    ) {
     
      setNotification(<AddRideNeg />);

     
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return;
    }


    





    try {
      const reply = await fetch("/api/createRide/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: addFormData.clientName,   
          phoneNumber: addFormData.phoneNumber,     
          address: addFormData.address,
          startTime: addFormData.startTime,
        }),
      });

      const data = await reply.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }


       
  
    // else we want to add the new ride if the inputs are filled
    const newRide = {

      id: nanoid(),
      clientName: addFormData.clientName,
      phoneNumber: addFormData.phoneNumber,
      address: addFormData.address,
      startTime: addFormData.startTime,
      status: "Added",
      volunteerName: "",
      hours: 0,
      date: new Date().toLocaleDateString(), 
      time: new Date().toLocaleTimeString(), 
    };

    const newRidesData = [...ridesData, newRide];
    setRidesData(newRidesData);

  
    setAddFormData({
      clientName: "",
      phoneNumber: "",
      address: "",
      startTime: "",
    });

   
    setNotification(<AddRidePositive />);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const tabs = [
    {
      aKey: "added",
      title: "Added/Unreserved", 
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

