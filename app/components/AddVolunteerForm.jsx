import { useState } from "react";

const AddVolunteerForm = ({
  handleAddFormSubmit,
  handleAddFormChange,
  addFormData,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  return (
    <div className="max-w-[70%] mx-auto">
      <h2 className="text-left font-light text-2xl mb-5">Add a Volunteer</h2>
      <form
        className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0"
        onSubmit={handleAddFormSubmit}
      >
        <div className="w-full lg:w-1/4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={addFormData.firstName}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={addFormData.lastName}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="email"
            name="email"
            placeholder="Email"
            value={addFormData.email}
            onChange={handleAddFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="phone"
            placeholder="Phone"
            value={addFormData.phone}
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

export default AddVolunteerForm;