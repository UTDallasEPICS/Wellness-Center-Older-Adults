"use client";
import React, { useState, useEffect } from 'react';
import SimpleTab, { Tab } from "/app/components/SimpleTab.jsx";
import ClientInputForm from "/app/components/ClientInputForm.jsx";
import DeleteConfirmationModal from "/app/components/DeleteConfirmationModal.jsx";
import ClientTable from "/app/components/ClientTable.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Search, Plus } from 'lucide-react';


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
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // States
    const [clients, setClients] = useState([]); // Holds ALL clients (active and archived)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // Default to active clients
    const [searchTerm, setSearchTerm] = useState('');
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [clientToChangeStatus, setClientToChangeStatus] = useState(null);


    // --- Data Fetching and CRUD Operations ---

    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            // Assuming this endpoint fetches all clients, and we filter on the frontend
            // If your API supports filtering (e.g., /getCustomer?status=all), use that instead for better performance.
            const response = await fetch('/api/customer/getCustomer'); 
            if (!response.ok) {
                throw new Error(`Failed to fetch client data: ${response.status}`);
            }
            const data = await response.json();
            // Ensure isArchived is a boolean for predictable filtering
            const formattedData = data.map(client => ({
                ...client,
                isArchived: client.isArchived === true || client.isArchived === 1
            }));
            setClients(formattedData);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setError('Failed to load client data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const tabFromQuery = searchParams.get('tab');
        if (tabFromQuery && ['active', 'archived'].includes(tabFromQuery)) {
            setActiveTab(tabFromQuery);
        }
        fetchClients();
    }, [searchParams]);

    const closeModalAndRefresh = () => {
        setIsAddClientModalOpen(false);
        setIsEditClientModalOpen(false);
        setClientToEdit(null);
        setShowDeleteModal(false);
        setClientToDelete(null);
        setShowArchiveModal(false);
        setShowRestoreModal(false);
        setClientToChangeStatus(null);
        fetchClients(); // Refresh the list after an operation
    };
    
    const handleAddClientSubmit = (newClient) => {
        setIsAddClientModalOpen(false);

        fetch('/api/createCustomerAccount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClient),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add client');
                }
                return response.json();
            })
            .then(data => {
                toast.success('Client added successfully!');
                closeModalAndRefresh();
            })
            .catch(error => {
                console.error('Error adding client:', error);
                toast.error('Failed to add client.');
            });
    };

    const handleEditClientSubmit = async (updatedClient) => {
        setIsEditClientModalOpen(false);

        try {
            const response = await fetch(`/api/customer/updateCustomer/${clientToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedClient),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update client');
            }

            toast.success('Client updated successfully!');
            closeModalAndRefresh();
        } catch (error) {
            console.error('Error updating client:', error);
            toast.error(error.message || 'Failed to update client.');
        }
    };

    const handleDeleteClick = (clientId) => {
        setClientToDelete(clientId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const clientIdToDelete = clientToDelete;

        setShowDeleteModal(false);
        setClientToDelete(null);

        try {
            const response = await fetch(`/api/customer/deleteCustomer/${clientIdToDelete}`, { 
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
        setClientToDelete(null);
    };

    const handleEditClick = (client) => {
        setClientToEdit(client);
        setIsEditClientModalOpen(true);
    };


    // --- New Archiving Logic ---

    const handleArchiveClick = (clientId) => {
        setClientToChangeStatus(clientId);
        setShowArchiveModal(true);
    };

    const handleRestoreClick = (clientId) => {
        setClientToChangeStatus(clientId);
        setShowRestoreModal(true);
    };

    const handleStatusChange = async (clientId, isArchived) => {
        setShowArchiveModal(false);
        setShowRestoreModal(false);
        setClientToChangeStatus(null);

        try {
            const response = await fetch(`/api/customer/archiveCustomer/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isArchived: isArchived }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `Failed to ${isArchived ? 'archive' : 'restore'} client`);
            }

            const message = isArchived ? "Client archived successfully!" : "Client restored successfully!";
            toast.success(message);
            
            // Switch tab after archiving/restoring
            if (isArchived) {
                setActiveTab('archived');
                // 🛠️ CORRECTED PATH HERE
                router.push('/Dashboard/client?tab=archived', undefined, { shallow: true });
            } else {
                setActiveTab('active');
                // 🛠️ CORRECTED PATH HERE
                router.push('/Dashboard/client?tab=active', undefined, { shallow: true });
            }
            
            closeModalAndRefresh();
        } catch (error) {
            console.error(`Error changing client status:`, error);
            toast.error(error.message || `Failed to change client status.`);
        }
    };

    // --- Tab and Filtering Logic ---
    
    const filterClients = (isArchived) => {
        return clients.filter(client => client.isArchived === isArchived);
    };
    
    const tabs = [
        {
            aKey: "active",
            title: "Clients",
            content: (
                <ClientTable // <<< Using imported component
                    clients={filterClients(false)}
                    onEditClient={handleEditClick}
                    onDeleteClient={handleDeleteClick}
                    onArchiveClient={handleArchiveClick}
                    onRestoreClient={handleRestoreClick}
                    searchTerm={searchTerm}
                    isArchivedView={false}
                />
            ),
        },
        {
            aKey: "archived",
            title: "Archived",
            content: (
                <ClientTable // <<< Using imported component
                    clients={filterClients(true)}
                    onEditClient={handleEditClick}
                    onDeleteClient={handleDeleteClick}
                    onArchiveClient={handleArchiveClick}
                    onRestoreClient={handleRestoreClick}
                    searchTerm={searchTerm}
                    isArchivedView={true}
                />
            ),
        },
    ];
    
    // --- Loading and Error Display ---

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

    // --- Main Component Render ---
    return (
        <div className="h-full w-full p-10 bg-[#f4f4f4] flex justify-center">
            <div className="max-w-6xl w-full">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-light text-gray-800">Clients</h1>
                    <button
                        type="button"
                        className="h-12 w-12 rounded-full text-white bg-[#0da000] hover:bg-[#0c8a00] transition-colors flex items-center justify-center shadow-lg"
                        onClick={() => setIsAddClientModalOpen(true)}
                    >
                        <Plus size={28} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by Name, Phone, or Email..."
                            className="w-full py-3.5 pl-12 pr-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#0da000]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    <button
                        type="button"
                        className="py-3 px-8 text-lg font-semibold rounded-lg text-white bg-[#0da000] hover:bg-[#0c8a00] transition-colors shadow-md"
                        onClick={() => {}} 
                    >
                        Search
                    </button>
                </div>

                {/* Tabbed Content */}
                <SimpleTab 
                    activeKey={activeTab} 
                    onChange={(key) => {
                        setActiveTab(key);
                        // 🛠️ CORRECTED PATH HERE
                        router.push(`/Dashboard/client?tab=${key}`, undefined, { shallow: true });
                    }}
                    tabClassName="text-xl font-semibold px-4 py-2"
                    activeTabClassName="text-[#0da000] border-b-4 border-[#0da000]" 
                    inactiveTabClassName="text-gray-500 hover:text-[#0da000]/80 transition-colors"
                >
                    {tabs.map((item) => (
                        <Tab 
                            key={item.aKey} 
                            aKey={item.aKey} 
                            title={item.title}
                        >
                            <div className="mt-4">
                                {item.content}
                            </div>
                        </Tab>
                    ))}
                </SimpleTab>

            </div>

            {/* Add Client Modal */}
            {isAddClientModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsAddClientModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-5">Add a Client</h2>
                        <ClientInputForm onSubmit={handleAddClientSubmit} onClose={() => setIsAddClientModalOpen(false)} />
                    </div>
                </div>
            )}

            {/* Edit Client Modal */}
            {isEditClientModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsEditClientModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-5">Edit Client</h2>
                        <ClientInputForm
                            onSubmit={handleEditClientSubmit}
                            onClose={() => setIsEditClientModalOpen(false)}
                            initialData={clientToEdit}
                        />
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={handleCancelDelete}>&times;</button>
                        <h2 className="text-left font-light text-xl mb-3 text-red-600">Confirm Deletion</h2>
                        <p className="mb-4">
                            Are you sure you want to permanently delete client: **{clients.find(c => c.id === clientToDelete)?.firstName} {clients.find(c => c.id === clientToDelete)?.lastName}**? This action cannot be undone.
                        </p>
                        <div className="flex justify-end">
                            <button onClick={handleCancelDelete} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive Confirmation Modal */}
            {showArchiveModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setShowArchiveModal(false)}>&times;</button>
                        <h2 className="text-left font-light text-xl mb-3 text-yellow-600">Confirm Archive</h2>
                        <p className="mb-4">
                            Are you sure you want to archive client: **{clients.find(c => c.id === clientToChangeStatus)?.firstName} {clients.find(c => c.id === clientToChangeStatus)?.lastName}**? They will be moved to the Archived tab.
                        </p>
                        <div className="flex justify-end">
                            <button onClick={() => setShowArchiveModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2">
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleStatusChange(clientToChangeStatus, true)} 
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Confirmation Modal */}
            {showRestoreModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setShowRestoreModal(false)}>&times;</button>
                        <h2 className="text-left font-light text-xl mb-3 text-blue-600">Confirm Restore</h2>
                        <p className="mb-4">
                            Are you sure you want to restore client: **{clients.find(c => c.id === clientToChangeStatus)?.firstName} {clients.find(c => c.id === clientToChangeStatus)?.lastName}**? They will be moved back to the Clients tab.
                        </p>
                        <div className="flex justify-end">
                            <button onClick={() => setShowRestoreModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2">
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleStatusChange(clientToChangeStatus, false)} 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Restore
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}