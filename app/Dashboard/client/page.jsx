"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, X, Archive, Users, UserCheck, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock Router (for URL updates)
const router = {
    push: (path) => console.log(`[Router Mock] Navigating to: ${path}`),
};

// --- UTILITY FUNCTIONS ---

// Function to safely get client name for deletion confirmation
const getClientName = (customers, id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Client';
};

// --- SHARED UI COMPONENTS (Modal & Tabs) ---

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative">
            <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={onClose}
                aria-label="Close modal"
            >
                <X size={24} />
            </button>
            <h2 className="text-left font-light text-3xl mb-5 border-b pb-2 text-gray-800">{title}</h2>
            {children}
        </div>
    </div>
);

const SimpleTab = ({ activeKey, onChange, children, tabClassName, activeTabClassName, inactiveTabClassName }) => {
    const tabs = React.Children.toArray(children).map(child => ({
        aKey: child.props.aKey,
        title: child.props.title,
        content: child.props.children,
    }));

    return (
        <div className="rounded-xl overflow-hidden shadow-xl">
            <div className="flex border-b border-gray-200 bg-white">
                {tabs.map((tab) => (
                    <button
                        key={tab.aKey}
                        onClick={() => onChange(tab.aKey)}
                        className={`
                            ${tabClassName} 
                            ${activeKey === tab.aKey ? activeTabClassName : inactiveTabClassName} 
                            focus:outline-none transition-all duration-300
                        `}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="p-4 pt-6 bg-[#f4f4f4] min-h-[400px]">
                {tabs.find(tab => tab.aKey === activeKey)?.content}
            </div>
        </div>
    );
};

// eslint-disable-next-line no-unused-vars
const Tab = ({ aKey, title, children }) => null;


// --- MOCK CLIENT INPUT FORM (Placeheld for /app/components/ClientInputForm.jsx) ---
const ClientInputForm = ({ onSubmit, onClose, initialData = {} }) => {
    const [formData, setFormData] = useState({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        customerPhone: initialData.customerPhone || '',
        email: initialData.email || '',
        street: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        postalCode: initialData.address?.postalCode || '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerData = {
            id: initialData.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            customerPhone: formData.customerPhone,
            email: formData.email,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
            },
            isArchived: initialData.isArchived || false // Preserve existing status
        };
        onSubmit(customerData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="p-3 border rounded-lg focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="p-3 border rounded-lg focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
            </div>
            <input type="tel" name="customerPhone" placeholder="Phone Number" value={formData.customerPhone} onChange={handleChange} required className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
            <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleChange} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
            <h3 className="font-semibold pt-2 text-gray-700">Address</h3>
            <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
            <div className="grid grid-cols-3 gap-4">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
                <input type="text" name="postalCode" placeholder="ZIP" value={formData.postalCode} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-[#419902] focus:border-transparent" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-[#419902] rounded-lg hover:bg-[#378300] transition-colors font-medium">
                    {initialData.id ? 'Save Changes' : 'Add Client'}
                </button>
            </div>
        </form>
    );
};


// --- CLIENT MANAGEMENT VIEW ---

const ClientManagementView = ({
    customers,
    searchQuery,
    setSearchQuery,
    setIsAddCustomerModalOpen,
    handleEditClick,
    handleDeleteClick,
    handleToggleArchive,
    tabKey
}) => {
    
    const filterClients = useCallback(() => {
        const isArchivedTab = tabKey === 'archived';
        
        // 1. Filter by tab status (isArchived)
        const clientsByStatus = customers.filter(customer => 
            (customer.isArchived === true && isArchivedTab) || 
            (customer.isArchived !== true && !isArchivedTab)
        );

        if (!searchQuery) {
            return clientsByStatus;
        }

        // 2. Filter by search query
        const searchLower = searchQuery.toLowerCase();
        return clientsByStatus.filter(customer => {
            const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
            const addressString = `${customer.address?.street} ${customer.address?.city} ${customer.address?.state}`.toLowerCase();

            return fullName.includes(searchLower) || 
                   customer.customerPhone.includes(searchQuery) ||
                   addressString.includes(searchLower) ||
                   (customer.email && customer.email.toLowerCase().includes(searchLower));
        });
    }, [customers, searchQuery, tabKey]);


    const filteredCustomers = filterClients();

    return (
        <div className="w-full bg-[#f4f4f4] space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Name, Phone, or Location..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#419902] focus:border-transparent transition-shadow"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <button
                    type="button"
                    className="w-full sm:w-auto mt-4 sm:mt-0 bg-[#419902] hover:bg-[#378300] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-200 shadow-md"
                    onClick={() => setIsAddCustomerModalOpen(true)}
                >
                    <Plus size={20} />
                    <span>Add New Client</span>
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#103713] uppercase tracking-wider">Client Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#103713] uppercase tracking-wider hidden sm:table-cell">Contact Number</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#103713] uppercase tracking-wider hidden md:table-cell">Address</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-[#103713] uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                                            <span className="text-gray-600 font-medium">
                                                {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-[#103713]">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500 sm:hidden">
                                                {customer.customerPhone}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-[#103713]">{customer.customerPhone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell max-w-xs truncate">
                                    <div className="text-sm text-[#103713]">
                                        {`${customer.address?.street || ''}, ${customer.address?.city || ''}, ${customer.address?.state || ''}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={() => handleEditClick(customer)}
                                            className="text-blue-600 hover:text-blue-800 transition duration-150 p-1 rounded-md hover:bg-blue-50"
                                            aria-label={`Edit ${customer.firstName}`}
                                        >
                                            <Edit size={18} />
                                        </button>

                                        {/* Archive/Unarchive Button */}
                                        <button
                                            onClick={() => handleToggleArchive(customer.id, !customer.isArchived)}
                                            className={`transition duration-150 p-1 rounded-md ${
                                                customer.isArchived
                                                    ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                                    : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                                            }`}
                                            aria-label={customer.isArchived ? "Restore Client" : "Archive Client"}
                                        >
                                            {customer.isArchived ? <ArrowLeft size={18} /> : <Archive size={18} />}
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDeleteClick(customer.id)}
                                            className="text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-md hover:bg-red-50"
                                            aria-label={`Delete ${customer.firstName}`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredCustomers.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No clients found in this tab.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN APPLICATION COMPONENT (Page.jsx) ---

export default function Page() {
    // State
    const [activeTab, setActiveTab] = useState('in_progress');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState(null);
    
    // --- DATA FETCHING & LIFECYCLE ---

    // 🟢 Client Fetching (Real API logic from your prompt)
    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Note: Assuming the API returns all customers, regardless of archive status
            const response = await fetch('/api/customer/getCustomer'); 
            if (!response.ok) {
                throw new Error(`Failed to fetch client data: ${response.status}`);
            }
            const data = await response.json();
            // Data coming from DB might not have the 'isArchived' field, so we ensure it exists.
            setCustomers(data.map(c => ({...c, isArchived: c.isArchived || false})));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load client data');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // --- CLIENT MANAGEMENT HANDLERS (Using Real API Logic) ---
    
    const closeModalAndRefresh = () => {
        setIsAddCustomerModalOpen(false);
        setIsEditCustomerModalOpen(false);
        setCustomerToEdit(null);
        fetchCustomers();
    };

    const handleAddCustomerSubmit = (newCustomer) => {
        setIsAddCustomerModalOpen(false);
        // Include default isArchived status for new clients
        const clientData = { ...newCustomer, isArchived: false }; 

        fetch('/api/createCustomerAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to add client');
                return response.json();
            })
            .then(() => {
                toast.success('Client added successfully!');
                closeModalAndRefresh();
            })
            .catch(error => {
                console.error('Error adding customer:', error);
                toast.error(error.message || 'Failed to add client.');
            });
    };

    const handleEditCustomerSubmit = async (updatedCustomer) => {
        setIsEditCustomerModalOpen(false);
        
        try {
            // Ensure isArchived status is preserved in the update payload
            const customerId = updatedCustomer.id || customerToEdit.id;
            const payload = {
                ...updatedCustomer,
                isArchived: updatedCustomer.isArchived !== undefined ? updatedCustomer.isArchived : customerToEdit.isArchived
            };
            
            const response = await fetch(`/api/customer/updateCustomer/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update customer');
            }

            toast.success('Client updated successfully!');
            closeModalAndRefresh();
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error(error.message || 'Failed to update client.');
        }
    };
    
    const handleToggleArchive = async (customerId, archiveStatus) => {
        try {
            // Find the full customer object to ensure we send all necessary fields
            const customer = customers.find(c => c.id === customerId);
            if (!customer) throw new Error("Client not found for status update.");

            // Create payload for the PUT request
            const payload = {
                ...customer,
                isArchived: archiveStatus, // Set the new status
            };
            
            const response = await fetch(`/api/customer/updateCustomer/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update client status');
            }

            toast.success(archiveStatus ? 'Client archived successfully!' : 'Client restored successfully!');
            fetchCustomers(); // Refresh the list
        } catch (error) {
            console.error('Error toggling archive status:', error);
            toast.error(error.message || `Failed to ${archiveStatus ? 'archive' : 'restore'} client.`);
        }
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
            closeModalAndRefresh();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error(error.message || "Failed to delete client.");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    const handleEditClick = (customer) => {
        setCustomerToEdit(customer);
        setIsEditCustomerModalOpen(true);
    };
    
    // --- RENDER LOGIC ---

    const tabData = [
        {
            aKey: "in_progress",
            title: (
                <span className="flex items-center space-x-2">
                    <UserCheck size={20} />
                    <span>In Progress</span>
                </span>
            ),
            content: (
                <ClientManagementView
                    customers={customers}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsAddCustomerModalOpen={setIsAddCustomerModalOpen}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    handleToggleArchive={handleToggleArchive}
                    tabKey="in_progress"
                />
            ),
        },
        {
            aKey: "archived",
            title: (
                <span className="flex items-center space-x-2">
                    <Archive size={20} />
                    <span>Archived</span>
                </span>
            ),
            content: (
                <ClientManagementView
                    customers={customers}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsAddCustomerModalOpen={setIsAddCustomerModalOpen}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    handleToggleArchive={handleToggleArchive}
                    tabKey="archived"
                />
            ),
        },
    ];


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#f4f4f4]">
                <p className="text-xl text-gray-600">Loading Client Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#f4f4f4] text-red-500">
                <p className="text-xl">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#f4f4f4] p-4 sm:p-10 flex justify-center">
            <div className="max-w-7xl w-full">
                
                <h1 className="text-4xl font-light text-gray-800 mb-6">Client Management</h1>

                <SimpleTab 
                    activeKey={activeTab} 
                    onChange={(key) => {
                        setActiveTab(key);
                        router.push(`/Dashboard/clients?tab=${key}`, undefined, { shallow: true });
                    }}
                    tabClassName="text-xl font-semibold px-6 py-4"
                    activeTabClassName="text-gray-800 border-b-4 border-gray-800 bg-white" 
                    inactiveTabClassName="text-gray-500 hover:text-gray-800/80 bg-gray-100"
                >
                    {tabData.map((item) => (
                        <Tab key={item.aKey} aKey={item.aKey} title={item.title}>
                            {item.content}
                        </Tab>
                    ))}
                </SimpleTab>

                {/* --- MODALS --- */}
                
                {isAddCustomerModalOpen && (
                    <Modal title="Add a New Client" onClose={closeModalAndRefresh}>
                        <ClientInputForm onSubmit={handleAddCustomerSubmit} onClose={closeModalAndRefresh} />
                    </Modal>
                )}

                {isEditCustomerModalOpen && (
                    <Modal title="Edit Client Details" onClose={closeModalAndRefresh}>
                        <ClientInputForm
                            onSubmit={handleEditCustomerSubmit}
                            onClose={closeModalAndRefresh}
                            initialData={customerToEdit}
                        />
                    </Modal>
                )}
                
                {showDeleteModal && (
                    <Modal title="Confirm Deletion" onClose={handleCancelDelete}>
                        <div className="flex items-center text-red-700 mb-4">
                            <AlertTriangle size={24} className="mr-2" />
                            <p className="font-semibold">
                                Are you sure you want to permanently delete client: **{getClientName(customers, customerToDelete)}**?
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            This action cannot be undone. You should typically **Archive** a client instead of deleting them.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={handleCancelDelete} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                Confirm Delete
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}