import { useState } from "react";

const AddRideForm = ({
  handleAddFormSubmit,
  handleAddFormChange,
  addFormData,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
  });

  return (
    <div className="max-w-[70%] mx-auto">
      <h2 className="text-left font-light text-2xl mb-5">Add a Ride</h2>
      <form className="flex flex-row items-center lg:flex-col lg:items-stretch space-y-4 lg:space-y-0 lg:space-x-0 space-x-4" onSubmit={handleAddFormSubmit}>
        <input
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md flex-1 m-1.5 placeholder-gray-500"
          type="text"
          name="clientName"
          required="required"
          placeholder="Client Name"
          value={addFormData.clientName}
          onChange={handleAddFormChange}
        />
        <input
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md flex-1 m-1.5 placeholder-gray-500"
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Client Phone"
          value={addFormData.phoneNumber}
          onChange={handleAddFormChange}
        />
        <input
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md flex-1 m-1.5 placeholder-gray-500"
          type="text"
          name="address"
          required="required"
          placeholder="Client Address"
          value={addFormData.address}
          onChange={handleAddFormChange}
        />
        <button
          className="bg-green-600 text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-green-700 ml-2.5"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddRideForm;
