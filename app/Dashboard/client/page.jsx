// client/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import ClientInputForm from "/app/components/ClientInputForm.jsx";
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [searchQuery, setSearchQuery] = useState('');

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

        fetch('/api/createCustomerAccount', {
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
                window.location.reload();
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
            const response = await fetch(`/api/customer/deleteCustomer/${customerIdToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete client');
            }

            toast.success("Client deleted successfully!");
            window.location.reload();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error(error.message || "Failed to delete client.");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    // Filter customers based on search query
    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        return fullName.includes(searchLower) || 
               customer.customerPhone.includes(searchQuery) ||
               (customer.email && customer.email.toLowerCase().includes(searchLower));
    });

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
        <div className="w-full min-h-screen bg-[#f4f1f0] p-6">
            {/* Header Section */}
            <div className="flex flex-col mb-6">
                <h1 className="text-2xl font-light text-gray-800 mb-4">Clients</h1>
                
                {/* Search Bar and Add Button */}
                <div className="flex items-center justify-between">
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Client..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <button
                        type="button"
                        className="bg-[#0da000] hover:bg-[#0c8a00] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
                        onClick={() => setIsAddCustomerModalOpen(true)}
                    >
                        <span className="material-symbols-rounded text-xl">+</span>
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#103713] uppercase tracking-wider">Client Name</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#103713] uppercase tracking-wider">Contact Number</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#103713] uppercase tracking-wider">Address</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-[#103713] uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-gray-600 font-medium">
                                                {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-[#103713]">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                @{customer.firstName?.toLowerCase()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-[#103713]">{customer.customerPhone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-[#103713]">
                                        {`${customer.address?.street || ''}, ${customer.address?.city || ''}, ${customer.address?.state || ''} ${customer.address?.postalCode || ''}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-3">
                                        <button className="text-green-600 hover:text-blue-900 transition duration-150">
                                            <span className="material-symbols-rounded text-lg">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(customer.id)}
                                            className="text-red-600 hover:text-red-900 transition duration-150"
                                        >
                                            <span className="material-symbols-rounded text-lg">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredCustomers.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No clients found.</p>
                    </div>
                )}
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