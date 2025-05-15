// app/components/AddRidesTable.jsx
"use client";
import { useState, useEffect } from "react";
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";

const AddRidesTable = ({ initialContacts, convertTime, onEditRide, onDeleteRide }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerID: "",
    date: "",
    startAddressID: "",
    pickupTime: "",
  });

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      customerID: contact.customerID,
      date: contact.date ? contact.date.split('T')[0] : '', // Format date for input
      startAddressID: contact.startAddressID,
      pickupTime: contact.startTime  ? contact.startTime .slice(0, 5) : '', // Format time for input (HH:MM)
    };
    setEditFormData(formValues);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    let pickupDateTimeISO = null;
    if (editFormData.date && editFormData.pickupTime) {
      const [hours, minutes] = editFormData.pickupTime.split(':');
      const dateObj = new Date(editFormData.date);
      // Set the time on the date object
      dateObj.setHours(parseInt(hours, 10));
      dateObj.setMinutes(parseInt(minutes, 10));
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      pickupDateTimeISO = dateObj.toISOString();
    }

const editedContact = {
    id: editContactId,
    customerID: editFormData.customerID ? parseInt(editFormData.customerID) : null,
    date: editFormData.date ? new Date(editFormData.date).toISOString() : null,
    startAddressID: editFormData.startAddressID ? parseInt(editFormData.startAddressID) : null,
    endAddressID: editFormData.endAddressID ? parseInt(editFormData.endAddressID) : null,
    pickupTime: pickupDateTimeISO, // Now a full ISO 8601 DateTime
    volunteerID: editFormData.volunteerID ? parseInt(editFormData.volunteerID) : null,
    status: contacts.find((contact) => contact.id === editContactId)?.status || 'Unreserved',
};

    onEditRide(editedContact);
    setEditContactId(null);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    onDeleteRide(contactId); // Call the onDeleteRide prop to delete the data
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto bg-[#fffdf5] max-h-[400px] overflow-y-auto font-sans">
      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="bg-[#fffdf5] border-collapse ml-[0.5%] w-[99%]">
          <thead>
            <tr>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((contact) => contact.status === "Unreserved" || contact.status === "AVAILABLE")
              .map((contact) => (
                editContactId === contact.id ? (
                  <EditableRow
                    key={contact.id}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                    convertTime={convertTime}
                  />
                ) : (
                  <ReadOnlyRow
                    key={contact.id}
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    convertTime={convertTime}
                    status={contact.status}
                  />
                )
              ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default AddRidesTable;