// app/components/ReadOnlyClientRow.jsx
import React from 'react';

const ReadOnlyClientRow = ({ contact, handleDeleteClick }) => {
    return (
        <tr key={contact?.id}>
            <td className="border-b-[0.5px] border-gray-400 p-2 text-center">{contact?.firstName}</td>
            <td className="border-b-[0.5px] border-gray-400 p-2 text-center">{contact?.lastName}</td>
            <td className="border-b-[0.5px] border-gray-400 p-2 text-center">
                {contact?.address?.street}, {contact?.address?.city}, {contact?.address?.state} {contact?.address?.postalCode}
            </td>
            <td className="border-b-[0.5px] border-gray-400 p-2 text-center">{contact?.customerPhone}</td>
            <td className="border-b-[0.5px] border-gray-400 p-2 text-center"> {/* You might want to display a client-specific status here later */}</td>
            <td className="border-b-[0.5px] border-gray-400 p-2 text-center">
                <button
                    type="button"
                    onClick={() => handleDeleteClick(contact?.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default ReadOnlyClientRow;