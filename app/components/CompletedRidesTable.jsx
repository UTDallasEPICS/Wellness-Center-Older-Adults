{/*https://www.youtube.com/watch?v=dYjdzpZv5yc */ }

import { useState, Fragment, useEffect } from "react";
import "/app/styles/ridesTable.css";
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";


const CompletedRidesTable = ({ initialContacts }) => {

  {/* Creates array of data calling from data file*/ }
  const [contacts, setContacts] = useState(initialContacts); {/*Change later to pull from data base or replace the data structure from import */ }

  const [editContactId, setEditContactId] = useState(null);


  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);


    const handleEditClick = (event, contact) => {
      event.preventDefault();
      setEditContactId(contact.id);
      const formValues = {
        clientName: contact.clientName,
        phoneNumber: contact.phoneNumber,
        address: contact.address,
        startTime: contact.startTime,
        volunteerName: contact.volunteerName,
      }
      setEditFormData(formValues);
    };

    const [editFormData, setEditFormData] = useState({
      clientName: "",
      phoneNumber: "",
      address: "",
      startTime: "",
      volunteerName: "",
    });
    
    const handleEditFormChange = (event) => {
      event.preventDefault();
      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  }


  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const editedContact = {
      id: editContactId,
      clientName: editFormData.clientName,
      phoneNumber: editFormData.phoneNumber,
      address: editFormData.address,
      startTime: editFormData.startTime,
      volunteerName: editFormData.volunteerName,
      status: contacts.find(contact => contact.id === editContactId).status,
      hours: contacts.find(contact => contact.id === editContactId).hours
    }
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === editContactId);
    newContacts[index] = editedContact;
    setContacts(newContacts);
    setEditContactId(null);
  }

  const handleCancelClick = () => {
    setEditContactId(null);
  }
 

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === contactId);
    newContacts.splice(index, 1);
    setContacts(newContacts);
  }



  return (

    <div className="tableContainer">
      <form className="rideTableForm" onSubmit={handleEditFormSubmit}>
      <table className = "ridesTable">
        {/* Serves as the header of the table */}
        <thead>
          <tr>
            <th className="rideTableHeader">Client Name</th>
            <th className="rideTableHeader">Contact Number</th>
            <th className="rideTableHeader">Address</th>
            <th className="rideTableHeader">Pick-up Time</th>
            <th className="rideTableHeader">Volunteer Name</th>
            <th className="rideTableHeader">Actions</th>
            
          </tr>
        </thead>

        {/* Stores the data */}
        <tbody>
          {/*Pulls element from the data structure to map out information */}
          
          {contacts.filter(contact => contact.status === "Completed").map(contact => (
            <Fragment  key={contact.id}>
              {editContactId === contact.id ? (
              <EditableRow editFormData = {editFormData} handleEditFormChange = {handleEditFormChange} status = {contact.status}
              handleCancelClick={handleCancelClick}/>
              ) :(
              <ReadOnlyRow  key={contact.id} contact={contact} handleEditClick ={handleEditClick} handleDeleteClick={handleDeleteClick} status = {contact.status}/>
              )}
              
            </Fragment>
           
           ))}
        
        </tbody>
      </table>
      {/*Could prob make this a separate component to make it a prompt to add info */}
      </form>

    </div>
  );
}

export default CompletedRidesTable;