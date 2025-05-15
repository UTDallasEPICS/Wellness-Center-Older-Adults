// client/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import ClientInputForm from "/app/components/ClientInputForm.jsx";
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx";
import AddClientsTable from "/app/components/AddClientsTable.jsx"; // Import the new component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ... (rest of your modal styles remain the same)

export default function Page() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/customer/getCustomer');
            if (!response.ok) {
                throw new Error(`Failed to fetch customer data: ${response.status}`);
            }
            const data = await response.json();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load customer data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleAddCustomerSubmit = (newCustomer) => {
        setIsAddCustomerModalOpen(false);

        fetch('/api/createCustomerAccount', { // Updated API endpoint URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer),
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to add customer:', response.status);
                    throw new Error('Failed to add customer');
                }
                return response.json();
            })
            .then(data => {
                console.log('Customer added successfully:', data);
                toast.success('Client added successfully!');
                window.location.reload(); // Reload after successful add
            })
            .catch(error => {
                console.error('Error adding customer:', error);
                toast.error('Failed to add client.');
            });
    };

    const handleDeleteClick = (customerId) => {
        console.log("Delete button clicked for CustomerID:", customerId);
        setCustomerToDelete(customerId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        console.log("handleConfirmDelete called. customerToDelete:", customerToDelete);
        const customerIdToDelete = customerToDelete;

        setShowDeleteModal(false);
        setCustomerToDelete(null);

        try {
            const response = await fetch(`/api/customer/deleteCustomer/${customerIdToDelete}`, { // Updated API endpoint
                method: 'DELETE', // Changed to DELETE
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete client'); // Updated error message
            }

            toast.success("Client deleted successfully!"); // Updated success message
            window.location.reload(); // Reload after successful delete
        } catch (error) {
            console.error('Error deleting client:', error); // Updated error message
            toast.error(error.message || "Failed to delete client."); // Updated error message
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading Clients...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#fffdf5] flex flex-col relative"> {/* Main container */}
            <div className="flex flex-row items-center bg-[#fffdf5] py-8 px-8"> {/* Header */}
                <div className="text-black text-left font-light text-[30px]">
                    <h1>Clients</h1>
                </div>
                <div className="ml-auto flex pr-6 pr-4 pt-4">
                    <button
                        type="button"
                        className="h-[45px] w-[45px] rounded-full text-white bg-[#419902] border-none flex items-center justify-center shadow-md mr-2"
                        onClick={() => setIsAddCustomerModalOpen(true)}
                    >
                        <span className="material-symbols-rounded">add</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 text-black px-6 py-4 font-light text-[15px] bg-[#fffdf5] border-b border-gray-300 w-full">
                <p>Name</p>
                <p>Address</p>
                <p>Phone</p>
                <div></div> {/* Empty column for potential actions */}
            </div>

            {/* Client List Table */}
            <div className="w-full flex flex-col text-black bg-white border-t border-b border-gray-300">
                {customers.map((customer, index) => (
                    <div key={index} className="grid grid-cols-5 py-4 border-b bg-[#fffdf5] border-gray-300 px-6">
                        <p>{`${customer.firstName} ${customer.lastName}`}</p>
                        <p>{`${customer.address?.street || ''}, ${customer.address?.city || ''}, ${customer.address?.state || ''} ${customer.address?.postalCode || ''}`}</p>
                        <p>{customer.customerPhone}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => handleDeleteClick(customer.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <span className="material-symbols-rounded">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isAddCustomerModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsAddCustomerModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-5">Add a Client</h2>
                        <ClientInputForm onSubmit={handleAddCustomerSubmit} onClose={() => setIsAddCustomerModalOpen(false)} />
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={handleCancelDelete}>&times;</button>
                        <p className="mb-4">Are you sure you want to delete client: {customers.find(c => c.id === customerToDelete)?.firstName} {customers.find(c => c.id === customerToDelete)?.lastName}?</p>
                        <div className="flex justify-end">
                            <button onClick={handleCancelDelete} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}