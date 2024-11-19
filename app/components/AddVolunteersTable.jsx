import React from 'react';
import ReadOnlyVolunteerRow from './ReadOnlyVolunteerRow';

const AddVolunteersTable = ({
  volunteersData,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-white">
      <h2 className="text-center text-[1.2rem] font-light text-gray-500 mt-4 mb-2">
        Volunteers
      </h2>
      <div className="border-b-[3px] border-gray-600 w-[20%] mx-auto mb-2 mt-[-10px]"></div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">First Name</th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Last Name</th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Email</th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Phone</th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Status</th>
            <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          
          {volunteersData.map((volunteer) => (
            <ReadOnlyVolunteerRow
              key={volunteer.id}
              contact={volunteer}
              handleEditClick={handleEditClick} 
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddVolunteersTable;
