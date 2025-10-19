"use client";
import { useState, useEffect } from "react";
// Reverting to original absolute paths as requested
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";

const AddRidesTable = ({ initialContacts, convertTime, onEditRide, onDeleteRide, customers, addresses, volunteers }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [editContactId, setEditContactId] = useState(null);
  // State to hold the user's role, used for conditional UI
  const [userRole, setUserRole] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    phoneNumber: "",
    date: "",
    startAddress: "",
    pickupTime: "",
    volunteerName: "",
  });

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  // --- Role Fetching Logic ---
  // Fetch the user's role from the API on component mount
  useEffect(() => {
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
  }, []);
  // ---------------------------

  // Helper function to get volunteer name from ID
  const getVolunteerNameById = (volunteerID) => {
    const volunteer = volunteers?.find(v => v.id === volunteerID);
    if (volunteer && volunteer.user) {
      return `${volunteer.user.firstName} ${volunteer.user.lastName}`;
    }
    return '';
  };

  // Helper function to find customer ID by name
  const getCustomerIdByName = (customerName) => {
    const customer = customers?.find(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase() === customerName.toLowerCase()
    );
    return customer?.id || null;
  };

  // Helper function to find address ID by address string
  const getAddressIdByString = (addressString) => {
    const address = addresses?.find(a => {
      const fullAddress = `${a.street}, ${a.city}, ${a.state} ${a.postalCode}`;
      return fullAddress.toLowerCase() === addressString.toLowerCase();
    });
    return address?.id || null;
  };

  // Helper function to find volunteer ID by name
  const getVolunteerIdByName = (volunteerName) => {
    const volunteer = volunteers?.find(v => {
      if (v.user) {
        const fullName = `${v.user.firstName} ${v.user.lastName}`;
        return fullName.toLowerCase() === volunteerName.toLowerCase();
      }
      return false;
    });
    return volunteer?.id || null;
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      customerName: contact.customerName || '',
      phoneNumber: contact.customerPhone || '',
      date: contact.date ? contact.date.split('T')[0] : '',
      startAddress: contact.startLocation || '',
      pickupTime: contact.startTime ? contact.startTime.slice(0, 5) : '',
      volunteerName: getVolunteerNameById(contact.volunteerID),
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
      dateObj.setHours(parseInt(hours, 10));
      dateObj.setMinutes(parseInt(minutes, 10));
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      pickupDateTimeISO = dateObj.toISOString();
    }

    // Get the original contact to preserve the existing IDs
    const originalContact = contacts.find((contact) => contact.id === editContactId);

    // Parse customer name and phone changes
    let customerUpdates = null;
    const currentCustomerName = originalContact.customerName;
    const currentCustomerPhone = originalContact.customerPhone;

    console.log("=== CUSTOMER CHANGE DETECTION ===");
    console.log("Current name:", currentCustomerName);
    console.log("New name:", editFormData.customerName);
    console.log("Current phone:", currentCustomerPhone);
    console.log("New phone:", editFormData.phoneNumber);

    if (editFormData.customerName !== currentCustomerName || editFormData.phoneNumber !== currentCustomerPhone) {
      const [firstName, ...lastNameParts] = editFormData.customerName.split(' ');
      customerUpdates = {
        id: originalContact.customerID,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        customerPhone: editFormData.phoneNumber || currentCustomerPhone
      };

      console.log("=== CUSTOMER UPDATES CREATED ===");
      console.log("Customer updates object:", customerUpdates);
    }

    // Parse address changes
    let addressUpdates = null;
    if (editFormData.startAddress && editFormData.startAddress !== originalContact.startLocation) {
      const addressParts = editFormData.startAddress.split(',').map(part => part.trim());
      if (addressParts.length >= 3) {
        const street = addressParts[0];
        const city = addressParts[1];
        const stateAndZip = addressParts[2].split(' ');
        const state = stateAndZip[0];
        const postalCode = stateAndZip.slice(1).join(' ');

        addressUpdates = {
          id: originalContact.startAddressID,
          street: street,
          city: city,
          state: state,
          postalCode: postalCode
        };
      }
    }

    // Parse volunteer changes
    let volunteerUpdates = null;
    const currentVolunteerName = getVolunteerNameById(originalContact.volunteerID);
    if (editFormData.volunteerName && editFormData.volunteerName !== currentVolunteerName) {
      const volunteerID = getVolunteerIdByName(editFormData.volunteerName);
      volunteerUpdates = {
        volunteerID: volunteerID
      };
    }

    const editedContact = {
      id: editContactId,
      customerID: originalContact.customerID,
      date: editFormData.date ? new Date(editFormData.date).toISOString() : null,
      startAddressID: originalContact.startAddressID,
      endAddressID: originalContact.endAddressID,
      pickupTime: pickupDateTimeISO,
      volunteerID: volunteerUpdates?.volunteerID || originalContact.volunteerID,
      status: originalContact.status || 'Unreserved',
      customerUpdates: customerUpdates,
      addressUpdates: addressUpdates,
      volunteerUpdates: volunteerUpdates
    };

    onEditRide(editedContact);
    setEditContactId(null);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    onDeleteRide(contactId);
  };

  // Placeholder function for the Volunteer's Reserve action
  const handleReserveRide = (rideId) => {
    console.log(`Volunteer attempting to reserve ride: ${rideId}`);
    // TODO: Implement actual API call to update ride status and assign volunteer
    // This function should eventually be connected to an update handler passed from the parent.
  };

  // Show a loading indicator while the user's role is being determined
  if (userRole === null) {
    return (
      <div className="flex justify-center items-center h-40 bg-[#fffdf5] font-sans text-xl text-gray-500 rounded-lg shadow-inner">
        Loading user permissions...
      </div>
    );
  }

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
              {/* Conditionally add the Volunteer Name header if the user is an Admin or if any rides are reserved/completed */}
              {(userRole === "ADMIN" || contacts.some(c => c.status === "Reserved" || c.status === "Completed")) && (
                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Volunteer</th>
              )}
              <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              // Show only Unreserved/Available rides in this specific table view
              .filter((contact) => contact.status === "Unreserved" || contact.status === "AVAILABLE")
              .map((contact) => (
                editContactId === contact.id ? (
                  <EditableRow
                    key={contact.id}
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                    convertTime={convertTime}
                    customers={customers}
                    addresses={addresses}
                    status={contact.status}
                  />
                ) : (
                  <ReadOnlyRow
                    key={contact.id}
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    // Pass the new reserve handler for Volunteer action
                    handleReserveClick={handleReserveRide}
                    convertTime={convertTime}
                    status={contact.status}
                    startAddress={contact.startLocation}
                    // Pass the fetched user role
                    userRole={userRole}
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