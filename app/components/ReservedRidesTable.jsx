// Updated ReservedRidesTable.jsx with correct field mappings
import { useState, Fragment, useEffect } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const ReservedRidesTable = ({ 
    initialContacts, 
    onRideDeleted, 
    onRideUpdated, 
    convertTime, 
    isVolunteer,
    // NEW PROPS FOR CHECKBOX SELECTION 
    selectedRides, 
    onToggleSelect,
    onToggleAll 
}) => {
    // Filter contacts to only show reserved rides in this table
    const reservedContacts = initialContacts.filter((contact) => contact.status === "Reserved");

    const [contacts, setContacts] = useState(reservedContacts);
    const [editContactId, setEditContactId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        customerName: "",
        phoneNumber: "",
        startAddress: "",
        startTime: "",
        volunteerName: "",
    });

    useEffect(() => {
        // Update contacts when initialContacts prop changes
        setContacts(reservedContacts);
    }, [initialContacts]);

    // ⬇️ CHECKBOX LOGIC ⬇️
    // Determine if the "select all" checkbox should be checked.
    const allSelected = contacts.length > 0 && 
                        contacts.every(ride => selectedRides.includes(ride.id));
    // ----------------------

    const handleEditClick = (event, contact) => {
        event.preventDefault();
        setEditContactId(contact.id);
        const formValues = {
            customerName: contact.customerName,
            phoneNumber: contact.phoneNumber,
            // Assuming the contact object has startLocation as the full address string
            startAddress: contact.startLocation || contact.startAddress, 
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
        
        // This logic will need enhancement in the future to correctly handle IDs (customerID, addressID, volunteerID)
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
        // This handles deletion when called by the ReadOnlyRow
        if (onRideDeleted) onRideDeleted(contactId);
        
        // Optimistic removal from local state (if the delete API call succeeds, parent will update)
        const newContacts = contacts.filter((contact) => contact.id !== contactId);
        setContacts(newContacts);
    };

    return (
        <div className="flex flex-col gap-2.5 p-4 font-sans overflow-x-auto max-h-[400px] overflow-y-auto">
            <form className="flex gap-1.5" onSubmit={handleEditFormSubmit}>
                <table className="border-collapse ml-[0.5%] w-[99%]">
                    <thead>
                        <tr>
                            {/* NEW CHECKBOX HEADER  */}
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
                            
                            {/* Volunteer Name column is present for Reserved/Completed rides */}
                            {!isVolunteer && (
                                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Volunteer Name</th>
                            )}
                            
                            {/* Actions column is visible if the user is NOT a Volunteer */}
                            {!isVolunteer && (
                                <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {contacts
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
                                            isVolunteer={isVolunteer} // This passes down the user role logic
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

export default ReservedRidesTable;
