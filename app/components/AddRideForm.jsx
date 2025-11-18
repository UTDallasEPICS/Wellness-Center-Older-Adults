import { useState, useEffect } from "react";

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
        waitTime: 0,
        extraInfo: "",
    });

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
        console.log("handleSubmit function called!");
        e.preventDefault();

        try {
            const selectedCustomer = customers.find(
                (customer) => customer.firstName === formData.customerName
            );

            if (!selectedCustomer) {
                console.error("Error: Selected customer not found.");
                return;
            }

            const rideDataToSend = {
                customerId: selectedCustomer.id,
                customerName: formData.customerName,
                pickupStreet: formData.pickupStreet,
                pickupCity: formData.pickupCity,
                pickupState: formData.pickupState,
                pickupZip: formData.pickupZip,
                destinationStreet: formData.destinationStreet,
                destinationCity: formData.destinationCity,
                destinationState: formData.destinationState,
                destinationZip: formData.destinationZip,
                pickUpTime: formData.pickUpTime,
                date: formData.date,
                waitTime: formData.waitTime && formData.waitTime !== '' 
                    ? Number(formData.waitTime) 
                    : 0,
                extraInfo: formData.extraInfo,
            };

            console.log("Data being sent:", rideDataToSend);

            const response = await fetch("/api/rides", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rideDataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error adding ride:", errorData);
                return;
            }

            const newRide = await response.json();
            console.log("Ride added successfully!", newRide);
            onClose();
            handleAddFormSubmit(newRide);
        } catch (error) {
            console.error("Error sending ride data:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-left font-light text-2xl">Add a Ride</h2>
                        <button
                            type="submit"
                            className="bg-[#419902] text-white px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#378300]"
                        >
                            Add
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">
                        {/* Customer Name */}
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

                        {/* Pick-Up Street */}
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

                        {/* Pick-Up City */}
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

                        {/* Pick-Up State */}
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

                        {/* Pick-Up Zip */}
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

                        {/* Destination Street */}
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

                        {/* Destination City */}
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

                        {/* Destination State */}
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

                        {/* Destination Zip */}
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

                        {/* Pick-Up Time */}
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

                        {/* Date */}
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

                        {/* Wait Time Field */}
                        <div>
                            <label htmlFor="waitTime" className="block text-sm font-medium text-gray-700">
                                Wait Time (hours)
                            </label>
                            <input
                                className="w-full p-2.5 text-sm border border-gray-300 rounded-md placeholder-gray-500"
                                type="number"
                                step="0.25"
                                min="0"
                                name="waitTime"
                                placeholder="e.g., 0.5"
                                value={formData.waitTime ?? ''}
                                onChange={handleFormChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter as decimal (e.g., 0.5 for 30 minutes)</p>
                        </div>

                        {/* Notes Checkbox */}
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

                        {/* Other Notes (if notes is checked) */}
                        {isExtraOptionChecked && (
                            <div className="col-span-2">
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
                            className="bg-[#e2dbd0]/70 text-[gray-700] px-6 py-2.5 text-base rounded-lg cursor-pointer hover:bg-[#e2dbd0]"
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