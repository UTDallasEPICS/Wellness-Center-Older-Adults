import React from 'react';
import ReadOnlyVolunteerRow from './ReadOnlyVolunteerRow';

const AddVolunteersTable = ({
  volunteersData,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <div className="flex flex-col gap-2.5 p-4 max-h-[400px] overflow-x-auto overflow-y-auto font-sans rounded-lg border border-gray-300">
      <h2 className="text-center text-[1.2rem] font-light text-gray-500 mt-4 mb-2">
        Volunteers
      </h2>
      <div className="border-b-[3px] border-gray-600 w-[20%] mx-auto mb-2 mt-[-10px]"></div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="bg-white text-center p-2 text-sm font-semibold border-b-[0.5px] border-gray-700">Name</th>
            <th className="bg-white text-center p-2 text-sm font-semibold border-b-[0.5px] border-gray-700">Phone</th>
            <th className="bg-white text-center p-2 text-sm font-semibold border-b-[0.5px] border-gray-700">Email</th>
            <th className="bg-white text-center p-2 text-sm font-semibold border-b-[0.5px] border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteersData.map((volunteer) => (
            <ReadOnlyVolunteerRow
              key={volunteer.id}
              contact={volunteer}
              handleEditClick={handleEditClick} // Ensure this is passed
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddVolunteersTable;
