import { useState, useEffect } from "react";
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const prisma = new PrismaClient(); // Initialize Prisma client

const AddRideForm = ({ isOpen, onClose, handleAddFormSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    pickupStreet: "",
    pickupCity: "",
    pickupState: "",
    pickupZip: "",
    destinationStreet: "",
    destinationCity: "",
    destinationState: "",
    destinationZip: "",
    pickUpTime: "",
    date: "",
    ways: "",
    extraInfo: "",
  });

  const [isTwoWayChecked, setIsTwoWayChecked] = useState(false);
  const [isExtraOptionChecked, setIsExtraOptionChecked] = useState(false);
  const [customerNames, setCustomerNames] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customer/getCustomer");
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        setCustomers(data);
        const names = data.map((customer) => customer.firstName);
        setCustomerNames(names);
        console.log("Fetched Customers:", data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    }

    fetchCustomers();
  }, []);

  const handleCheckboxChange = (e, setStateFunction) => {
    setStateFunction(e.target.checked);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "customerName") {
      const selectedCustomer = customers.find(
        (customer) => customer.firstName === value
      );

      if (selectedCustomer) {
        setFormData((prevData) => ({
          ...prevData,
          customerName: value,
          pickupStreet: selectedCustomer.address?.street || "",
          pickupCity: selectedCustomer.address?.city || "",
          pickupState: selectedCustomer.address?.state || "",
          pickupZip: selectedCustomer.address?.postalCode || "",
          destinationStreet: selectedCustomer.address?.street || "",
          destinationCity: selectedCustomer.address?.city || "",
          destinationState: selectedCustomer.address?.state || "",
          destinationZip: selectedCustomer.address?.postalCode || "",
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          customerName: value,
          pickupStreet: "",
          pickupCity: "",
          pickupState: "",
          pickupZip: "",
          destinationStreet: "",
          destinationCity: "",
          destinationState: "",
          destinationZip: "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const customer = customers.find((c) => c.firstName === formData.customerName);
        if (!customer) {
            console.error("Customer not found.");
            return;
        }
        const startAddress = await prisma.address.create({
            data: {
                street: formData.pickupStreet,
                city: formData.pickupCity,
                state: formData.pickupState,
                postalCode: formData.pickupZip,
            },
        });

        const endAddress = await prisma.address.create({
            data: {
                street: formData.destinationStreet,
                city: formData.destinationCity,
                state: formData.destinationState,
                postalCode: formData.destinationZip,
            },
        });

        const newRide = await prisma.ride.create({
            data: {
                customerID: customer.id,
                date: new Date(formData.date),
                pickupTime: new Date(`1970-01-01T${formData.pickUpTime}:00.000Z`),
                startAddressID: startAddress.id,
                endAddressID: endAddress.id,
                specialNote: formData.extraInfo,
            },
        });

        console.log("Ride added successfully!");
        onClose();
        handleAddFormSubmit({ ...formData, id: newRide.id }); // Send the new ride data with the new ride id to parent
    } catch (error) {
        console.error("Error adding ride:", error);
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-left font-light text-2xl">Add a Ride</h2>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-green-700"
          >
            Add
          </button>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">
            {/* ... Pickup Address Fields ... */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <select
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                name="customerName"
                value={formData.customerName}
                onChange={handleFormChange}
              >
                <option value="">Select a Customer</option>
                {customerNames.map((name) => (
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

            {/* ... Destination Address Fields ... */}
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

            {/* ... Time, Date, Checkboxes, and Notes ... */}
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
    </div>
  );
};

export default AddRideForm;