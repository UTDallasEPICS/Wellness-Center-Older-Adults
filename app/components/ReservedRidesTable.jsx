// Updated ReservedRidesTable.jsx with correct field mappings
import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const ReservedRidesTable = ({ initialContacts, onRideDeleted, onRideUpdated, convertTime, isVolunteer }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    phoneNumber: "",
    startAddress: "",
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
      customerName: contact.customerName,
      phoneNumber: contact.phoneNumber,
      startAddress: contact.startAddress,
      startTime: contact.startTime,
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
    const updatedRide = {
      id: editContactId,
      customerName: editFormData.customerName,
      phoneNumber: editFormData.phoneNumber,
      startAddress: editFormData.startAddress,
      startTime: editFormData.startTime,
      volunteerName: editFormData.volunteerName,
      status: contacts.find((contact) => contact.id === editContactId).status,
    };

    const newContacts = contacts.map((contact) =>
      contact.id === editContactId ? updatedRide : contact
    );
    setContacts(newContacts);
    setEditContactId(null);
    if (onRideUpdated) onRideUpdated(updatedRide);
  };

  const handleCancelClick = async (contactId) => {
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    setContacts(newContacts);
    if (onRideDeleted) onRideDeleted(contactId);
  };

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
              {!isVolunteer && (
                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Volunteer Name</th>
              )}
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
                      isVolunteer={isVolunteer}
                    />
                  ) : (
                    <ReadOnlyRow
                      key={contact.id}
                      contact={contact}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={() => handleCancelClick(contact.id)}
                      status={contact.status}
                      convertTime={convertTime}
                      startAddress={contact.startAddress}
                      isVolunteer={isVolunteer}
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