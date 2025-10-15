// client/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import ClientInputForm from "/app/components/ClientInputForm.jsx";
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx"; // Assuming this is still used for the modal itself
import AddClientsTable from "/app/components/AddClientsTable.jsx"; // Import the new component
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assuming you have a Layout component that wraps this page and includes the Sidebar and Header.
// This component focuses on the main content area (the Clients list).

// Styles for Modals (can be moved to a global or component specific CSS file)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '500px',
    position: 'relative',
};

const modalCloseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
};

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
                fetchCustomers(); // Fetch updated list instead of full reload
            })
            .catch(error => {
                console.error('Error adding customer:', error);
                toast.error('Failed to add client.');
            });
    };

    const handleDeleteClick = (customerId) => {
        setCustomerToDelete(customerId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const customerIdToDelete = customerToDelete;

        setShowDeleteModal(false);
        setCustomerToDelete(null);

        try {
            const response = await fetch(`/api/customer/deleteCustomer/${customerIdToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete client');
            }

            toast.success("Client deleted successfully!");
            fetchCustomers(); // Fetch updated list instead of full reload
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error(error.message || "Failed to delete client.");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    // --- Loading and Error States (kept as is) ---
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
    // ---------------------------------------------


    return (
        // The main container for the content area, assuming a surrounding layout handles the sidebar
        // and top bar (logo, user icon).
        // This is only the right-hand main content section.
        <div className="flex-1 p-10 bg-[#f4f1f0] min-h-screen">
            {/* Header Area: Clients title and Add button */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl text-black font-normal">Clients</h1>
                <button
                    type="button"
                    className="h-10 w-10 rounded-full text-white bg-[#55a630] hover:bg-[#419902] transition-colors flex items-center justify-center shadow-lg"
                    onClick={() => setIsAddCustomerModalOpen(true)}
                >
                    <span className="text-3xl font-light">+</span>
                </button>
            </div>

            {/* Clients List Area: Using the imported AddClientsTable for the styled list */}
            <div className="">
                <AddClientsTable
                    customers={customers}
                    onDelete={handleDeleteClick}
                    // You might need to pass other props like onEdit to AddClientsTable
                />
            </div>


            {/* Add Client Modal */}
            {isAddCustomerModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsAddCustomerModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-5">Add a Client</h2>
                        <ClientInputForm onSubmit={handleAddCustomerSubmit} onClose={() => setIsAddCustomerModalOpen(false)} />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal (using existing logic) */}
            {showDeleteModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={handleCancelDelete}>&times;</button>
                        <p className="mb-4">
                            Are you sure you want to delete client:
                            <span className="font-semibold ml-1">
                                {customers.find(c => c.id === customerToDelete)?.firstName} {customers.find(c => c.id === customerToDelete)?.lastName}?
                            </span>
                        </p>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCancelDelete} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}