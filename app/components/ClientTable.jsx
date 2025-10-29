// /app/components/ClientTable.jsx
"use client";
import React from 'react';

const ClientTable = ({ clients, onEditClient, onDeleteClient, onArchiveClient, onRestoreClient, searchTerm, isArchivedView }) => {
    
    // Filter clients based on search query
    const filteredClients = clients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return fullName.includes(searchLower) || 
               (client.customerPhone && client.customerPhone.includes(searchTerm)) ||
               (client.email && client.email.toLowerCase().includes(searchLower));
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
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
                    {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">
                                            {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-[#103713]">
                                            {client.firstName} {client.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            @{client.firstName?.toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#103713]">{client.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-[#103713]">
                                    {`${client.address?.street || ''}, ${client.address?.city || ''}, ${client.address?.state || ''} ${client.address?.postalCode || ''}`}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-3">
                                    {/* Edit Button */}
                                    <button 
                                        onClick={() => onEditClient(client)}
                                        className="text-green-600 hover:text-blue-900 transition duration-150 p-1"
                                        title="Edit Client"
                                    >
                                        <span className="material-symbols-rounded text-lg">edit</span>
                                    </button>

                                    {/* Archive/Restore Button */}
                                    {isArchivedView ? (
                                        <button
                                            onClick={() => onRestoreClient(client.id)}
                                            className="text-blue-600 hover:text-blue-800 transition duration-150 p-1"
                                            title="Restore Client"
                                        >
                                            <span className="material-symbols-rounded text-lg">unarchive</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onArchiveClient(client.id)}
                                            className="text-yellow-600 hover:text-yellow-800 transition duration-150 p-1"
                                            title="Archive Client"
                                        >
                                            <span className="material-symbols-rounded text-lg">archive</span>
                                        </button>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => onDeleteClient(client.id)}
                                        className="text-red-600 hover:text-red-900 transition duration-150 p-1"
                                        title="Delete Client"
                                    >
                                        <span className="material-symbols-rounded text-lg">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {filteredClients.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">{isArchivedView ? 'No archived clients found.' : 'No active clients found.'}</p>
                </div>
            )}
        </div>
    );
};

export default ClientTable;