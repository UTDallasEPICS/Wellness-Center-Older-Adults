import React from 'react';
import ReadOnlyVolunteerRow from './ReadOnlyVolunteerRow'; 
import EditableVolunteerRow from './EditableVolunteerRow'; 

const AddVolunteersTable = ({
  volunteersData,
  handleEditClick,
  handleDeleteClick,
  handleSaveClick,
  handleEditFormChange,
  handleCancelClick,
  editVolunteerId,
  editFormData,
}) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteersData.map((volunteer) => (
            <>
              {editVolunteerId === volunteer.id ? (
                <EditableVolunteerRow
                  key={volunteer.id}
                  editFormData={editFormData}
                  handleEditFormChange={handleEditFormChange}
                  handleSaveClick={handleSaveClick}
                  handleCancelClick={handleCancelClick}
                />
              ) : (
                <ReadOnlyVolunteerRow
                  key={volunteer.id}
                  contact={volunteer}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddVolunteersTable;

