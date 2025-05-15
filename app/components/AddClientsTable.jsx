// app/components/AddClientsTable.jsx
import React from 'react';
import ReadOnlyClientRow from './ReadOnlyClientRow';

const AddClientsTable = ({ customers, handleDeleteClick }) => {
    return (
        <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-white">
            <h2 className="text-center text-[1.2rem] font-light text-gray-500 mt-4 mb-2">
                Clients
            </h2>
            <div className="border-b-[3px] border-gray-600 w-[20%] mx-auto mb-2 mt-[-10px]"></div>

            <table className="border-collapse w-full">
                <thead>
                    <tr>
                        <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">First Name</th>
                        <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Last Name</th>
                        <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Address</th>
                        <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Phone</th>
                        <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Status</th> {/* You can decide if you need a status for clients */}
                        <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers && customers.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-lg font-semibold p-4">
                                No clients available.
                            </td>
                        </tr>
                    ) : (
                        customers && customers.map((customer) => (
                            <ReadOnlyClientRow
                                key={customer?.id}
                                contact={customer}
                                handleDeleteClick={handleDeleteClick}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AddClientsTable;