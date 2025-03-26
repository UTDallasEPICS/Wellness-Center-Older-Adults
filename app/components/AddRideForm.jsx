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
<<<<<<< Updated upstream
        
      </form>
=======

        <form className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                {clientNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pickupStreet" className="block text-sm font-medium text-gray-700">
                Pick-Up Street
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="pickupStreet"
                placeholder="Street Address"
                value={formData.pickupStreet}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700">
                Pick-Up City
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="pickupCity"
                placeholder="City"
                value={formData.pickupCity}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="pickupState" className="block text-sm font-medium text-gray-700">
                Pick-Up State
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="pickupState"
                placeholder="State"
                value={formData.pickupState}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="pickupZip" className="block text-sm font-medium text-gray-700">
                Pick-Up Zip
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="pickupZip"
                placeholder="Zip Code"
                value={formData.pickupZip}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="destinationStreet" className="block text-sm font-medium text-gray-700">
                Destination Street
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="destinationStreet"
                placeholder="Street Address"
                value={formData.destinationStreet}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="destinationCity" className="block text-sm font-medium text-gray-700">
                Destination City
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="destinationCity"
                placeholder="City"
                value={formData.destinationCity}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="destinationState" className="block text-sm font-medium text-gray-700">
                Destination State
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="destinationState"
                placeholder="State"
                value={formData.destinationState}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="destinationZip" className="block text-sm font-medium text-gray-700">
                Destination Zip
              </label>
              <input
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                type="text"
                name="destinationZip"
                placeholder="Zip Code"
                value={formData.destinationZip}
                onChange={handleFormChange}
              />
            </div>

            <div>
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

            <div>
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

            <div className="flex items-center space-x-2">
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

            {isTwoWayChecked && (
              <div>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="extraOption"
                name="extraOption"
                checked={isExtraOptionChecked}
                onChange={(e) => handleCheckboxChange(e, setIsExtraOptionChecked)}
                className="w-5 h-5"
              />
              <label htmlFor="extraOption" className="text-sm font-medium text-gray-700">
                Notes?
              </label>
            </div>

            {isExtraOptionChecked && (
              <div>
                <label htmlFor="extraInfo" className="block text-sm font-medium text-gray-700">
                  Other Notes
                </label>
                <textarea
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                  name="extraInfo"
                  placeholder="Details"
                  value={formData.extraInfo}
                  onChange={handleFormChange}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="bg-gray-300 text-gray-700 px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-gray-400"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default AddRideForm;