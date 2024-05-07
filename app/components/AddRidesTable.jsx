{/*https://www.youtube.com/watch?v=dYjdzpZv5yc */}

import {useState, Fragment, useEffect} from "react";
import "app/styles/ridesTable.css";
import ReadOnlyRow from "app/components/ReadOnlyRow.jsx";
import EditableRow from "app/components/EditableRow.jsx";


const AddRidesTable = ({initialContacts}) => {
  
    {/* Creates array of data calling from data file*/}
    const [contacts, setContacts] = useState(initialContacts); {/*Change later to pull from data base or replace the data structure from import */}
   
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
      }
      setEditFormData(formValues);
    };

    const [editFormData, setEditFormData] = useState({
      clientName: "",
      phoneNumber: "",
      address: "",
      startTime: "",
    });
    
    const handleEditFormChange = (event) => {
      event.preventDefault();
      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = {...editFormData };
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
          startTime:editFormData.startTime,
          volunteerName: contacts.find(contact => contact.id === editContactId).volunteerName,
          status: contacts.find(contact => contact.id === editContactId).status,
          hours: contacts.find(contact => contact.id === editContactId).hours
        }
        const newContacts = [...contacts];
        const index = contacts.findIndex((contact)=> contact.id === editContactId);
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

  return(
    
    <div className = "tableContainer">
      <form onSubmit={handleEditFormSubmit}>
      <table>
        {/* Serves as the header of the table */}
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Pick-up Time</th>
            <th>Actions</th>
            
          </tr>
        </thead>

        {/* Stores the data */}
        <tbody>
          {/*Pulls element from the data structure to map out information */}
          
          {contacts.filter(contact => contact.status === "Added").map(contact => (
            <Fragment>
              {editContactId === contact.id ? (
              <EditableRow editFormData = {editFormData} handleEditFormChange = {handleEditFormChange}
              handleCancelClick={handleCancelClick}/>
              ) :(
              <ReadOnlyRow contact={contact} handleEditClick ={handleEditClick} handleDeleteClick={handleDeleteClick}/>
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

export default AddRidesTable;