import React from 'react';
import { Search, Edit, Trash2, Archive, RotateCcw } from 'lucide-react';
import { formatDateLong } from '../utils/dateUtils';

/**
 * Utility function to get a formatted date.
 * (You might need to adjust based on your actual data format)
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const formatted = formatDateLong(dateString);
        return formatted || 'Invalid Date';
    } catch {
        return 'Invalid Date';
    }
};

/**
 * ClientManagementView Component
 * Renders the search bar and the filtered table of clients.
 */
export default function ClientManagementView({
    customers,
    searchQuery,
    setSearchQuery,
    handleEditClick,
    handleDeleteClick,
    handleToggleArchive,
    tabKey // 'in_progress' or 'archived'
}) {

    // 1. Filter customers based on the active tab (isArchived status)
    const filteredByTab = customers.filter(customer => {
        const isArchived = customer.isArchived || false; // Default to false if property is missing
        return tabKey === 'archived' ? isArchived : !isArchived;
    });

    // 2. Filter the resulting list based on the search query
    const filteredClients = filteredByTab.filter(customer => {
        const query = searchQuery.toLowerCase();
        
        // Search by first name, last name, phone, or email
        return (
            (customer.firstName?.toLowerCase().includes(query) || 
             customer.lastName?.toLowerCase().includes(query) ||
             customer.phone?.includes(query) ||
             customer.email?.toLowerCase().includes(query))
        );
    });

    // Component for the Search Bar
    const SearchBar = (
        <div className="flex items-center space-x-2 w-full max-w-lg mb-6 p-2 border border-gray-300 rounded-lg shadow-sm bg-white">
            <Search size={20} className="text-gray-400 ml-1" />
            <input
                type="text"
                placeholder={`Search ${tabKey === 'archived' ? 'archived' : 'active'} clients by name, phone, or email...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 p-2 text-gray-700 outline-none placeholder-gray-500 bg-white"
            />
        </div>
    );

    const isInsideTab = tabKey === 'in_progress' || tabKey === 'archived';


    return (
        <div className="w-full">

            {isInsideTab && SearchBar}

            {filteredClients.length === 0 ? (
                <div className="text-center p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 mt-4">
                    <p className="text-xl text-gray-500">
                        {searchQuery ? `No clients found matching "${searchQuery}" in the ${tabKey} list.` : `No clients in the ${tabKey} list.`}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {client.firstName} {client.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">ID: {client.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <p>{client.email}</p>
                                        <p>{client.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(client.dateJoined)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEditClick(client)}
                                                className="text-[#419902] hover:text-[#378300] p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                aria-label="Edit Client"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            {/* Archive/Restore Button */}
                                            <button
                                                onClick={() => handleToggleArchive(client.id, !client.isArchived)}
                                                className={`${client.isArchived ? 'text-blue-600 hover:text-blue-800' : 'text-gray-500 hover:text-yellow-600'} p-1 rounded-full hover:bg-gray-100 transition-colors`}
                                                aria-label={client.isArchived ? "Restore Client" : "Archive Client"}
                                            >
                                                {client.isArchived ? <RotateCcw size={18} /> : <Archive size={18} />}
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(client.id)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                aria-label="Permanently Delete Client"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}