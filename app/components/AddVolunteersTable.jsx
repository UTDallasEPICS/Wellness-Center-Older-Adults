// // app\components\AddVolunteersTable.jsx
// import React from 'react';
// import ReadOnlyVolunteerRow from './ReadOnlyVolunteerRow';

// const AddVolunteersTable = ({
//   volunteersData,
//   handleEditClick,
//   handleDeleteClick,
// }) => {
//   return (
//     <div className="mt-[5%] ml-[calc(5%-20px)] w-[90%] text-left rounded-lg border border-gray-300 p-6 bg-white">

//       <table className="border-collapse w-full">
//         <thead>
//           <tr>
//             <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">First Name</th>
//             <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Last Name</th>
//             <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Email</th>
//             <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Phone</th>
//             <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Status</th>
//             <th className="bg-white border-b-[0.5px] border-gray-700 text-center p-2 text-lg font-normal">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {volunteersData && volunteersData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="text-center text-lg font-semibold p-4">
//                 No volunteers available.
//               </td>
//             </tr>
//           ) : (
//             volunteersData && volunteersData.map((volunteer) => (
//               <ReadOnlyVolunteerRow
//                 key={volunteer?.id}
//                 contact={volunteer}
//                 handleEditClick={handleEditClick}
//                 handleDeleteClick={handleDeleteClick}
//               />
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

// };

// export default AddVolunteersTable;
// app\components\AddVolunteersTable.jsx
import React from 'react';
import ReadOnlyVolunteerRow from './ReadOnlyVolunteerRow';

const AddVolunteersTable = ({
  volunteersData,
  handleEditClick,
  handleDeleteClick,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {volunteersData && volunteersData.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
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