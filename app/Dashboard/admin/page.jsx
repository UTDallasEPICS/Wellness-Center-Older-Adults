// app\Dashboard\admin\page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import AddAdminForm from '../../components/AddAdminForm.jsx';
import { toast, ToastContainer } from "react-toastify";
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
    zIndex: 50,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '90%',
    maxHeight: '90%',
    overflowY: 'auto',
    position: 'relative',
    width: '400px',
};

const modalCloseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    color: 'gray',
};

export default function AdminPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/getAdmin');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Failed to fetch admin data: ${response.status}` }));
                throw new Error(errorData.message);
            }
            const data = await response.json();
            setAdmins(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setError(error.message || 'Failed to load admin data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Filter admins based on search query
    const filteredAdmins = admins.filter(admin => {
        const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        return fullName.includes(searchLower) || 
               admin.email.toLowerCase().includes(searchLower) ||
               (admin.phone && admin.phone.includes(searchQuery));
    });

    const closeModalAndRefresh = () => {
        setIsAddAdminModalOpen(false);
        setIsEditAdminModalOpen(false);
        setAdminToEdit(null);
        fetchAdmins();
    };

    const handleAddAdminSubmit = async (newAdmin) => {
        setIsAddAdminModalOpen(false);

        try {
            const response = await fetch('/api/admin/addAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to add admin');
            }

            toast.success('Admin created successfully!');
            closeModalAndRefresh();
        } catch (error) {
            console.error('Error adding admin:', error);
            toast.error(error.message || 'Failed to add admin.');
        }
    };

    const handleEditClick = (admin) => {
        setAdminToEdit(admin);
        setIsEditAdminModalOpen(true);
    };

    const handleEditAdminSubmit = async (updatedAdmin) => {
        setIsEditAdminModalOpen(false);

        try {
            const adminId = updatedAdmin.id || adminToEdit.id;
            
            const response = await fetch(`/api/admin/updateAdmin/${adminId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAdmin),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to update admin');
            }

            toast.success('Admin updated successfully!');
            closeModalAndRefresh();
        } catch (error) {
            console.error('Error updating admin:', error);
            toast.error(error.message || 'Failed to update admin.');
        }
    };

    const handleDeleteClick = (adminId) => {
        setAdminToDelete(adminId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const adminIdToDelete = adminToDelete;
        const previousAdminsData = [...admins];

        setAdmins(admins.filter(admin => admin.id !== adminIdToDelete));
        setShowDeleteModal(false);
        setAdminToDelete(null);

        try {
            const response = await fetch(`/api/admin/deleteAdmin/${adminIdToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                setAdmins(previousAdminsData);
                const errorData = await response.json();
                throw new Error(errorData?.message || 'Failed to delete admin');
            }

            toast.success("Admin deleted successfully!");
        } catch (error) {
            console.error('Error deleting admin:', error);
            toast.error(error.message || "Failed to delete admin.");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAdminToDelete(null);
    };

    const getAdminFullName = (id) => {
        const admin = admins.find(a => a.id === id);
        return admin ? `${admin.firstName} ${admin.lastName}` : 'this admin';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <p>Loading Admins...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500 bg-white">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#f4f1f0] p-6">
            <ToastContainer />
            
            {/* Header Section */}
            <div className="flex flex-col mb-6">
                <h1 className="text-2xl font-light text-gray-800 mb-4">Admins</h1>
                
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
                            placeholder="Search by Admin..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <button
                        type="button"
                        className="bg-[#0da000] hover:bg-[#0c8a00] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
                        onClick={() => setIsAddAdminModalOpen(true)}
                    >
                        <span className="material-symbols-rounded text-lg">+</span>
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAdmins.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No admins found.
                                </td>
                            </tr>
                        ) : (
                            filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {admin.firstName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {admin.lastName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {admin.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {admin.phone || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 transition duration-150"
                                                type="button"
                                                onClick={() => handleEditClick(admin)}
                                            >
                                                <span className="material-symbols-rounded text-lg">edit</span>
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 transition duration-150"
                                                type="button"
                                                onClick={() => handleDeleteClick(admin.id)}
                                            >
                                                <span className="material-symbols-rounded text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {isAddAdminModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsAddAdminModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-5">Add New Admin</h2>
                        <AddAdminForm onSubmit={handleAddAdminSubmit} onClose={() => setIsAddAdminModalOpen(false)} />
                    </div>
                </div>
            )}

            {isEditAdminModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={() => setIsEditAdminModalOpen(false)}>&times;</button>
                        <h2 className="text-left font-light text-2xl mb-5">Edit Admin</h2>
                        <AddAdminForm
                            onSubmit={handleEditAdminSubmit}
                            onClose={() => setIsEditAdminModalOpen(false)}
                            initialData={adminToEdit}
                        />
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <button style={modalCloseButtonStyle} onClick={handleCancelDelete}>&times;</button>
                        <p className="mb-4">Are you sure you want to delete admin: <strong>{getAdminFullName(adminToDelete)}</strong>?</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={handleCancelDelete} 
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmDelete} 
                                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}