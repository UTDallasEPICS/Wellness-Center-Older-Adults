import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const CompletedRidesTable = ({
  initialContacts,
  convertTime,
  onDeleteRide,
  selectedRides,
  onToggleSelect,
  onToggleAll,
}) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    phoneNumber: "",
    startAddress: "",
    startTime: "",
    volunteerName: "",
  });
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setContacts(initialContacts);
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

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      customerName: contact.customerName,
      phoneNumber: contact.customerPhone || contact.phoneNumber,
      startAddress: contact.startLocation || contact.startAddress,
      pickupTime: contact.startTime,
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

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    setEditContactId(null);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    if (onDeleteRide) {
      onDeleteRide(contactId);
    }
  };

  const allSelected =
    contacts.length > 0 &&
    contacts.every((ride) => selectedRides.includes(ride.id));

  return (
    <div className="flex flex-col gap-2.5 p-4 overflow-x-auto max-h-[400px] overflow-y-auto font-sans">
      <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
        <table className="border-collapse ml-[0.5%] w-[99%]">
          <thead>
            <tr>
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
                Client Name & Date
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

          <tbody>
            {Array.isArray(initialContacts) &&
              initialContacts
                .filter((contact) => contact.status === "Completed")
                .map((contact) => (
                  <Fragment key={contact.id}>
                    {editContactId === contact.id ? (
                      <EditableRow
                        editFormData={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        status={contact.status}
                        handleCancelClick={handleCancelClick}
                        userRole={userRole}
                      />
                    ) : (
                      <ReadOnlyRow
                        key={contact.id}
                        contact={contact}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                        status={contact.status}
                        startAddress={
                          contact.startLocation || contact.startAddress
                        }
                        convertTime={convertTime}
                        userRole={userRole}
                        selected={selectedRides.includes(contact.id)}
                        onToggleSelect={onToggleSelect}
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

export default CompletedRidesTable;