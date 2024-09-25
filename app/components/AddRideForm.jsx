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
      <form
        className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0"
        onSubmit={handleAddFormSubmit}
      >
        <div className="w-full lg:w-1/4">
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
            Client Name
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={addFormData.clientName}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="phoneNumber"
            placeholder="Client Phone"
            value={addFormData.phoneNumber}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Client Address
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="address"
            placeholder="Client Address"
            value={addFormData.address}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Pick-Up Time
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="time"
            name="startTime"
            id="startTime"
            value={addFormData.startTime}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-auto flex items-end lg:mt-0 mt-4">
          <button
            className="bg-green-600 text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-green-700"
            type="submit"
          >
            Add
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default AddRideForm;
