import React from "react";
import { useRouter } from "next/navigation";

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick, status }) => {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/Dashboard/rides/ride/${contact.id}`);
  };

  return (
    <tr onClick={handleRowClick} className="cursor-pointer hover:bg-gray-100 transition-colors duration-200">
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
        {contact.customerName}
      </td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
        {contact.phoneNumber}
      </td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
        {contact.startAddressID}
      </td>
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
        {contact.startTime}
      </td>
      {status === "Reserved" || status === "Completed" ? (
        <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
          {contact.volunteerName}
        </td>
      ) : null}
      <td className="text-center bg-[#fffdf5] text-[20px] py-4 px-2 font-light">
        <div className="flex justify-center">
          <button
            className="text-white bg-[#419902] cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-[#2b6701]"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleEditClick(event, contact);
            }}
          >
            <span className="material-symbols-rounded">edit</span>
          </button>
          <button
            className="text-white bg-red-500 cursor-pointer border-none mx-1 px-4 py-2 rounded-md transition duration-300 hover:bg-red-700"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteClick(contact.id);
            }}
          >
            <span className="material-symbols-rounded">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;