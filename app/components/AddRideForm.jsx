import { useState } from "react";

const AddRideForm = ({ handleAddFormSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    pickupAddress: "",
    desinationAddress: "",
    pickUpTime: "",
    date: "",
    ways: "",
    extraInfo: "",
  });

  const [isTwoWayChecked, setIsTwoWayChecked] = useState(false);
  const [isExtraOptionChecked, setIsExtraOptionChecked] = useState(false);

  const handleCheckboxChange = (e, setStateFunction) => {
    setStateFunction(e.target.checked);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
          <select
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            name="clientName"
            value={formData.clientName}
            onChange={handleFormChange}
          >
            <option value="">Select a Client</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="destinationAddress" className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="text"
            name="desinationAddress"
            placeholder="Address"
            value={formData.desinationAddress}
            onChange={handleFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="pickUpTime" className="block text-sm font-medium text-gray-700">
            Pick-Up Time
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="time"
            name="pickUpTime"
            value={formData.pickUpTime}
            onChange={handleFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleFormChange}
          />
        </div>

        <div className="w-full lg:w-1/4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="twoWay"
            name="twoWay"
            checked={isTwoWayChecked}
            onChange={(e) => handleCheckboxChange(e, setIsTwoWayChecked)}
            className="w-5 h-5"
          />
          <label htmlFor="twoWay" className="text-sm font-medium text-gray-700">
            Two way?
          </label>
        </div>

        {/* Conditionally Rendered Input Field for One Way */}
        {isTwoWayChecked && (
          <div className="w-full lg:w-1/4">
            <label htmlFor="ways" className="block text-sm font-medium text-gray-700">
              Wait Time
            </label>
            <input
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
              type="text"
              name="ways"
              placeholder="Minutes"
              value={formData.ways}
              onChange={handleFormChange}
            />
          </div>
        )}

        <div className="w-full lg:w-1/4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="extraOption"
            name="extraOption"
            checked={isExtraOptionChecked}
            onChange={(e) => handleCheckboxChange(e, setIsExtraOptionChecked)}
            className="w-5 h-5"
          />
          <label htmlFor="extraOption" className="text-sm font-medium text-gray-700">
            Other Pickup?
          </label>
        </div>

        {/* Conditionally Rendered Input Field for Other Pickup */}
        {isExtraOptionChecked && (
          <div className="w-full lg:w-1/4">
            <label htmlFor="extraInfo" className="block text-sm font-medium text-gray-700">
              Extra Pickup Address
            </label>
            <input
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
              type="text"
              name="extraInfo"
              placeholder="Enter address"
              value={formData.extraInfo}
              onChange={handleFormChange}
            />
          </div>
        )}

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
