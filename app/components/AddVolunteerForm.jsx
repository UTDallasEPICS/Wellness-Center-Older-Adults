import React from "react";

const AddVolunteerForm = ({ addFormData, handleAddFormSubmit, handleAddFormChange }) => {
  return (
    <form onSubmit={handleAddFormSubmit} className="grid grid-cols-4 gap-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        className="border rounded-lg p-2 col-span-1"
        value={addFormData.name}
        onChange={handleAddFormChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        className="border rounded-lg p-2 col-span-1"
        value={addFormData.phone}
        onChange={handleAddFormChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border rounded-lg p-2 col-span-1"
        value={addFormData.email}
        onChange={handleAddFormChange}
      />
      <button
        type="submit"
        className="bg-green-500 text-white rounded-lg p-2 col-span-1"
      >
        Add
      </button>
    </form>
  );
};

export default AddVolunteerForm;

/*
import React from "react";

const AddVolunteerForm = ({ addFormData, handleAddFormSubmit, handleAddFormChange }) => {
  return (
    <div className="w-full mb-5">
      <form className="w-[80%] mx-auto flex justify-between items-center" onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="name"
          className="border border-gray-300 rounded px-4 py-2 w-[20%]"
          placeholder="Name"
          value={addFormData.name}
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="phone"
          className="border border-gray-300 rounded px-4 py-2 w-[20%]"
          placeholder="Phone"
          value={addFormData.phone}
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="email"
          className="border border-gray-300 rounded px-4 py-2 w-[30%]"
          placeholder="Email"
          value={addFormData.email}
          onChange={handleAddFormChange}
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded px-4 py-2"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddVolunteerForm;

*/