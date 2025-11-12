// app/components/CompletedRidesTable.jsx
import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const CompletedRidesTable = ({
  initialContacts,
  convertTime,
  onDeleteRide,
  selectedRides,
}) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    phoneNumber: "",
    startAddress: "",
    pickupTime: "",
    volunteerName: "",
  });
  const [editErrors, setEditErrors] = useState({
    customerName: "",
    phoneNumber: "",
    startAddress: "",
    pickupTime: "",
    volunteerName: "",
  });
  const [userRole, setUserRole] = useState(null);

  // useEffect(() => {
  // }, [initialContacts]);

  useEffect(() => {
    setContacts(initialContacts);
    // Update contacts when initialContacts prop changes
    (async () => {
      try {
        const res = await fetch("/api/getRole");
        if (!res.ok) throw new Error(res.statusText);
        const { role } = await res.json();
        setUserRole(role);
      } catch (e) {
        console.error("Could not load user role:", e);
        setUserRole("GUEST"); // Set a fallback role in case of failure
      }
    })();
  }, [initialContacts]);

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      customerName: contact.customerName,
      phoneNumber: contact.phoneNumber,
      startAddress: contact.startAddress,
      pickupTime: contact.pickupTime,
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
    if (editErrors[fieldName]) {
      setEditErrors({ ...editErrors, [fieldName]: "" });
    }
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    const errors = validateEditFields(editFormData);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      setEditErrors(errors);
      return;
    }
    // Placeholder for edit submission (in a real app, this would call an API)
    setEditContactId(null);
  };

  const validateEditFields = (data) => {
    const out = {
      customerName: "",
      phoneNumber: "",
      startAddress: "",
      pickupTime: "",
      volunteerName: "",
    };
    const name = (data.customerName || "").trim();
    const phoneRaw = (data.phoneNumber || "").trim();
    const address = (data.startAddress || "").trim();
    const time = (data.pickupTime || "").trim();
    const volunteer = (data.volunteerName || "").trim();

    const nameRe = /^[A-Za-z][A-Za-z' -]{0,79}$/;
    const timeRe = /^([0-1]?\d|2[0-3]):[0-5]\d$/;

    if (!name || !nameRe.test(name)) {
      out.customerName = "Client name is required and must be valid.";
    }
    if (!/^\d{10}$/.test(phoneRaw)) {
      out.phoneNumber = "Enter a valid 10-digit phone number.";
    }
    if (!address) {
      out.startAddress = "Address is required.";
    } else {
      const addrRe = /^.+,\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}$/;
      if (!addrRe.test(address)) {
        out.startAddress = "Enter address as 'Street, City, ST 12345'.";
      }
    }
    if (!time || !timeRe.test(time)) {
      out.pickupTime = "Enter a valid time (HH:MM).";
    }
    if (volunteer && !nameRe.test(volunteer)) {
      out.volunteerName = "Volunteer name must be valid.";
    }
    return out;
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
                Client Name
              </th>
              {/* <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Date
              </th> */}
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Time
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Contact Number
              </th>
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">
                Address
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
                        errors={editErrors}
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
                        // userRole="ADMIN"
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
