import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const ReservedRidesTable = ({
  initialContacts,
  onRideDeleted,
  onRideUpdated,
  convertTime,
  isVolunteer,
  selectedRides,
  onToggleSelect,
  onToggleAll,
}) => {
  // Filter contacts to only show reserved rides in this table
  const reservedContacts = initialContacts.filter(
    (contact) => contact.status === "Reserved"
  );

  const [userRole, setUserRole] = useState(null);
  const [contacts, setContacts] = useState(reservedContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    phoneNumber: "",
    startAddress: "",
    startTime: "",
    waitTime: 0,
    volunteerName: "",
  });

  useEffect(() => {
    // Update contacts when initialContacts prop changes
    setContacts(reservedContacts);
    (async () => {
      try {
        const res = await fetch("/api/getRole");
        if (!res.ok) throw new Error(res.statusText);
        const { role } = await res.json();
        setUserRole(role);
      } catch (e) {
        console.error("Could not load user role:", e);
        setUserRole("GUEST");
      }
    })();
  }, [initialContacts]);

  // Determine if the "select all" checkbox should be checked.
  const allSelected =
    contacts.length > 0 &&
    contacts.every((ride) => selectedRides.includes(ride.id));

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      customerName: contact.customerName,
      phoneNumber: contact.phoneNumber,
      startAddress: contact.startLocation || contact.startAddress,
      startTime: contact.startTime,
      waitTime: typeof contact.waitTime === 'number' ? contact.waitTime : 0,
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
      waitTime: editFormData.waitTime !== null && editFormData.waitTime !== '' 
        ? Number(editFormData.waitTime) 
        : null,
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
    if (onRideDeleted) onRideDeleted(contactId);

    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    setContacts(newContacts);
  };

  return (
    <div className="flex flex-col gap-2.5 p-4 font-sans overflow-x-auto max-h-[400px] overflow-y-auto">
      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="border-collapse ml-[0.5%] w-[99%]">
          <thead>
            <tr>
              {/* CHECKBOX HEADER */}
              {userRole === "ADMIN" && (
                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onToggleAll(contacts, e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-[#419902] focus:ring-[#419902]"
                  />
                </th>
              )}
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
                Wait Time
              </th>
              {/* Volunteer Name column is present for Reserved/Completed rides */}
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Volunteer Name
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
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
                    selected={selectedRides.includes(contact.id)}
                    onToggleSelect={onToggleSelect}
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