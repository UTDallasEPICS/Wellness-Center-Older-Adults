"use client";
import React, {useState, useEffect} from "react";
import SimpleTab, {Tab} from "app/components/SimpleTab.jsx";
import AddRidesTable from "app/components/AddRidesTable.jsx";
import ReservedRidesTable from "app/components/ReservedRidesTable.jsx";
import CompletedRidesTable from "app/components/CompletedRidesTable.jsx";
import AddRideForm from "app/components/AddRideForm.jsx";
import data from "app/mock-data.json";
import {nanoid} from "nanoid";



const tabbedPage = () => {
  const [ridesData, setRidesData] = useState(data);

  const [addFormData, setAddFormData] = useState({
    clientName: '',
    phoneNumber: '',
    address: '',
    startTime: '',
  });

  const handleAddFormChange = (event) =>{
    event.preventDefault();
    const fieldName = event.target.getAttribute('name'); {/*This is getting the name= attribute from the input form */}
    const fieldValue = event.target.value; {/*It is now getting the value stored in that name= attribute */}

    const newFormData = {...addFormData};
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newContact = {
      id: nanoid(),
      clientName: addFormData.clientName,
      phoneNumber: addFormData.phoneNumber,
      address: addFormData.address,
      startTime: addFormData.startTime,
      status:"Added",
      volunteerName:"",
      hours: 0,
    };
    const newContacts = [...ridesData, newContact];
    setRidesData(newContacts);
    setAddFormData({
      clientName: '',
      phoneNumber: '',
      address: '',
      startTime: '',
    });
    
  };

  const tabs =[
    {aKey: "added", title: "Added", content:<AddRidesTable initialContacts = {ridesData}/>},
    {aKey: "reserved", title: "Reserved", content:<ReservedRidesTable initialContacts = {ridesData}/>},
    {aKey: "completed", title: "Completed", content:<CompletedRidesTable initialContacts = {ridesData}/>},
    
  ]

 
  return(
      <div>
        
        <AddRideForm
          addFormData = {addFormData} handleAddFormSubmit = {handleAddFormSubmit} handleAddFormChange = {handleAddFormChange}
        />
        <SimpleTab activeKey="added">
          {tabs.map(item => <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
            {React.cloneElement(item.content, { initialContacts: ridesData })}
            </Tab>)}
        </SimpleTab>
      </div>

  );
}

export default tabbedPage;