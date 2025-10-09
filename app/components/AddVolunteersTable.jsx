// app\components\AddVolunteersTable.jsx
import React from 'react';
import ReadOnlyVolunteerRow from './ReadOnlyVolunteerRow';

const AddVolunteersTable = ({
  volunteersData,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-[#fffdf5]">

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">First Name</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Last Name</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Email</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Phone</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Status</th>
            <th className="bg-[#fffdf5] border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteersData && volunteersData.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-lg font-semibold p-4">
                No volunteers available.
              </td>
            </tr>
          ) : (
            volunteersData && volunteersData.map((volunteer) => (
              <ReadOnlyVolunteerRow
                key={volunteer?.id}
                contact={volunteer}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );

};

export default AddVolunteersTable;