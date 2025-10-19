"use client";
import { useState, useEffect } from "react";
// Reverting to original absolute paths as requested
import ReadOnlyRow from "/app/components/ReadOnlyRow.jsx";
import EditableRow from "/app/components/EditableRow.jsx";

const AddRidesTable = ({ 
    initialContacts, 
    convertTime, 
    onEditRide, 
    onDeleteRide, 
    customers, 
    addresses, 
    volunteers, 
    selectedRides, 
    onToggleSelect,
    onToggleAll 
}) => {
    // Filter contacts to only show unreserved/available rides in this table
    const unreservedContacts = initialContacts.filter((contact) => 
        contact.status === "Unreserved" || contact.status === "AVAILABLE" || contact.status === "Added"
    );

    const [contacts, setContacts] = useState(unreservedContacts);
    const [editContactId, setEditContactId] = useState(null);
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
        setContacts(unreservedContacts);
    }, [initialContacts]);

    // --- Role Fetching Logic ---
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

    // ⬇️ CHECKBOX LOGIC ⬇️
    const allSelected = contacts.length > 0 && 
                        contacts.every(ride => selectedRides.includes(ride.id));
    // ----------------------

    // Helper function to get volunteer name from ID
    const getVolunteerNameById = (volunteerID) => {
        const volunteer = volunteers?.find(v => v.id === volunteerID);
        if (volunteer && volunteer.user) {
            return `${volunteer.user.firstName} ${volunteer.user.lastName}`;
        }
        return '';
    };

    // Helper function to find customer ID by name (omitted for brevity, assume implemented)
    const getCustomerIdByName = (customerName) => {
        // ... implementation assumed
        return null; 
    };

    // Helper function to find address ID by address string (omitted for brevity, assume implemented)
    const getAddressIdByString = (addressString) => {
        // ... implementation assumed
        return null;
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

        const originalContact = contacts.find((contact) => contact.id === editContactId);

        let customerUpdates = null;
        const currentCustomerName = originalContact.customerName;
        const currentCustomerPhone = originalContact.customerPhone;

        if (editFormData.customerName !== currentCustomerName || editFormData.phoneNumber !== currentCustomerPhone) {
            const [firstName, ...lastNameParts] = editFormData.customerName.split(' ');
            customerUpdates = {
                id: originalContact.customerID,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                customerPhone: editFormData.phoneNumber || currentCustomerPhone
            };
        }

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

    const handleReserveRide = (rideId) => {
        console.log(`Volunteer attempting to reserve ride: ${rideId}`);
    };

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
                            {/* ⬇️ CHECKBOX HEADER ⬇️ */}
                            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal w-12">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={(e) => onToggleAll(contacts, e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-300 text-[#419902] focus:ring-[#419902]"
                                />
                            </th>
                            {/* ⬆️ END CHECKBOX HEADER ⬆️ */}
                            
                            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Client Name</th>
                            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Contact Number</th>
                            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
                            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Pick-up Time</th>
                            
                            {/* ❌ REMOVED CONDITIONAL VOLUNTEER HEADER ❌ 
                                Since this table only shows unreserved rides, we hide the column.
                            */}
                            
                            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts
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
                                        handleReserveClick={handleReserveRide}
                                        convertTime={convertTime}
                                        status={contact.status}
                                        startAddress={contact.startLocation}
                                        userRole={userRole}
                                        selected={selectedRides.includes(contact.id)}
                                        onToggleSelect={onToggleSelect}
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