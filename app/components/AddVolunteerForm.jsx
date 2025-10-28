// /app/components/AddVolunteerForm.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

const VolunteerForm = ({
  handleAddFormSubmit,
  handleAddFormChange,
  addFormData,
}) => {
  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={handleAddFormSubmit}
    >
      <div className="w-full">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={addFormData.firstName}
          onChange={handleAddFormChange}
          required
          pattern="^[A-Za-z' -]{2,50}$"
        />
      </div>

      <div className="w-full">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={addFormData.lastName}
          onChange={handleAddFormChange}
          required
          pattern="^[A-Za-z' -]{2,50}$"
        />
      </div>

      <div className="w-full">
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
          required
        />
      </div>

      <div className="w-full">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
          type="tel"
          name="phone"
          placeholder="Phone"
          value={addFormData.phone}
          onChange={handleAddFormChange}
          required
          inputMode="tel"
        />
      </div>

      <div className="w-full flex justify-end mt-4">
        <button
          className="bg-[#419902] text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#419902]"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default VolunteerForm;