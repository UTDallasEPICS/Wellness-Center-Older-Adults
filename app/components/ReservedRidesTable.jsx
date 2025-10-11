import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

// 1. ADD 'userRole' PROP HERE 👇
const ReservedRidesTable = ({ initialContacts, onRideDeleted, onRideUpdated, convertTime, userRole }) => {
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
  };

  const handleCancelClick = async (contactId) => {
    try {
      const response = await fetch(`/api/deleteRides/${contactId}`, { // ENSURE THIS IS CORRECT
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

  // Helper variable for clarity
  const showActionsColumn = userRole === 'volunteer';

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
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Volunteer Name</th>
              {/* 2. CONDITIONAL ACTIONS HEADER 👇 */}
              {showActionsColumn && (
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
                    />
                  ) : (
                    <ReadOnlyRow
                      key={contact.id}
                      contact={contact}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleCancelClick} // This will be the "Unreserve" action
                      status={contact.status}
                      convertTime={convertTime}
                      // 3. PASS 'userRole' DOWN TO ReadOnlyRow 👇
                      userRole={userRole}
                    />
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default ReservedRidesTable;