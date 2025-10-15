// app/components/AddClientsTable.jsx
import React from 'react';

const AddClientsTable = ({ customers, handleDeleteClick, searchQuery }) => {
    // Filter customers based on search query
    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        return fullName.includes(searchLower) || 
               customer.customerPhone.includes(searchQuery) ||
               (customer.email && customer.email.toLowerCase().includes(searchLower));
    });

    return (
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
                                        <div className="text-sm font-medium text-gray-900">
                                            {customer.firstName} {customer.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            @{customer.firstName?.toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {`${customer.address?.street || ''}, ${customer.address?.city || ''}, ${customer.address?.state || ''} ${customer.address?.postalCode || ''}`}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-3">
                                    <button className="text-blue-600 hover:text-blue-900 transition duration-150">
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
    );
};

export default AddClientsTable;