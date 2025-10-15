import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";

const CompletedRidesTable = ({ initialContacts }) => {
  const [contacts, setContacts] = useState(initialContacts);
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
    };
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
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const editedContact = {
      id: editContactId,
      clientName: editFormData.clientName,
      phoneNumber: editFormData.phoneNumber,
      address: editFormData.address,
      startTime: editFormData.startTime,
      volunteerName: editFormData.volunteerName,
      status: contacts.find((contact) => contact.id === editContactId).status,
      hours: contacts.find((contact) => contact.id === editContactId).hours,
    };
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === editContactId);
    newContacts[index] = editedContact;
    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === contactId);
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto bg-[#fffdf5] max-h-[400px] overflow-y-auto font-sans">
      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="bg-[#fffdf5] border-collapse ml-[0.5%] w-[99%]">
          {/* Serves as the header of the table */}
          <thead>
            <tr>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Client Name
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Contact Number
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Address
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Pick-up Time
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Volunteer Name
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Actions
              </th>
            </tr>
          </thead>

          {/* Stores the data */}
          <tbody>
            {/*Pulls element from the data structure to map out information */}
            {contacts
              .filter((contact) => contact.status === "Completed")
              .map((contact) => (
                <Fragment key={contact.id}>
                  {editContactId === contact.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormChange={handleEditFormChange}
                      status={contact.status}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnlyRow
                      key={contact.id}
                      contact={contact}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                      status={contact.status}
                    />
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
        {/* Could prob make this a separate component to make it a prompt to add info */}
      </form>
    </div>
  );
};

export default CompletedRidesTable;