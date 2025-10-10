import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

// NOTE: The previous full component needed 'isVolunteer' in the props. 
// I am re-adding it here as it was logically present in the component's JSX structure.
const ReservedRidesTable = ({ initialContacts, onRideDeleted, onRideUpdated, convertTime, isVolunteer }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    clientName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
    volunteerName: "",
  });

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
      startTime: convertTime ? convertTime(contact.startTime) : contact.startTime,
      volunteerName: contact.volunteerName,
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

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/rides/${editContactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        console.error("Failed to update ride:", response.status);
        return;
      }

      const updatedRide = await response.json();
      const newContacts = contacts.map((contact) =>
        contact.id === editContactId ? updatedRide : contact
      );
      setContacts(newContacts);
      setEditContactId(null);
      if (onRideUpdated) {
        onRideUpdated(updatedRide);
      }
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  }; // <--- CORRECTED: This brace closes handleEditFormSubmit

  const handleCancelClick = async (contactId) => {
    try {
      const response = await fetch(`/api/deleteRides/${contactId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error("Failed to cancel ride:", response.status);
        const errorData = await response.text();
        console.error("Error data:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Deletion successful:", data);

      if (onRideDeleted) {
        onRideDeleted(contactId);
      }
      const newContacts = contacts.filter((contact) => contact.id !== contactId);
      setContacts(newContacts);
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };


  // *** MISSING RETURN STATEMENT AND JSX START HERE ***
  return (
    <div className="flex flex-col gap-2.5 p-4 font-sans overflow-x-auto max-h-[400px] overflow-y-auto">
      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="border-collapse ml-[0.5%] w-[99%]">
          <thead>
            <tr>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
              {/* Conditionally render Volunteer Name header */}
              {!isVolunteer && (
                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Volunteer Name</th>
              )}
              {/* Conditionally render Actions header */}
              {!isVolunteer && (
                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((contact) => contact.status === "Reserved")
              .map((contact) => (
                <Fragment key={contact.id}>
                  {editContactId === contact.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormChange={handleEditFormChange}
                      status={contact.status}
                      handleCancelClick={() => setEditContactId(null)}
                      isVolunteer={isVolunteer} // Pass down isVolunteer
                    />
                  ) : (
                    <ReadOnlyRow
                      key={contact.id}
                      contact={contact}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleCancelClick}
                      status={contact.status}
                      convertTime={convertTime}
                      startAddress={contact.address}
                      isVolunteer={isVolunteer} // Pass down isVolunteer
                    />
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}; // <--- **CRITICAL: This brace closes the ReservedRidesTable component**

export default ReservedRidesTable;