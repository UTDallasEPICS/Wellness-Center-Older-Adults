// import React from "react";

// const ReadOnlyVolunteerRow = ({ contact, handleEditClick, handleDeleteClick }) => {
//   return (
//     <tr>
//       <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
//         {contact.firstName}
//       </td>

//       <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
//         {contact.lastName}
//       </td>

//       <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
//         {contact.email}
//       </td>

//       <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
//         {contact.phone}
//       </td>
//       <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
//         {contact.status}
//       </td>

//       <td className="text-center bg-white text-[20px] py-4 px-2 font-light">
//         <button
//           className="text-white bg-[#419902] cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-[#378300]"
//           type="button"
//           onClick={() => handleEditClick(contact)}
//         >
//          <span className="material-symbols-rounded">edit</span>
//         </button>
//         <button
//           className="text-white bg-red-600 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-red-700"
//           type="button"
//           onClick={() => handleDeleteClick(contact.id)} // Ensure you are passing contact.id
//         >
//           <span className="material-symbols-rounded">delete</span>
//         </button>
//       </td>
//     </tr>
//   );
// };

// export default ReadOnlyVolunteerRow;
import React from "react";

const ReadOnlyVolunteerRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.firstName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.phone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {contact.status || "AVAILABLE"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-3">
          <button
            className="text-blue-600 hover:text-blue-900 transition duration-150"
            type="button"
            onClick={() => handleEditClick(contact)}
          >
            <span className="material-symbols-rounded text-lg">edit</span>
          </button>
          <button
            className="text-red-600 hover:text-red-900 transition duration-150"
            type="button"
            onClick={() => handleDeleteClick(contact.id)}
          >
            <span className="material-symbols-rounded text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReadOnlyVolunteerRow;