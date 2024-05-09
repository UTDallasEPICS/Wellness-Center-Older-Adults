import { useState } from "react";
import "app/styles/addRideForm.css";

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
    <div className="addRideFormDiv ">
      <h2 className="addRideTitle">Add a Ride</h2>
      <form className="addRideFormContainer" onSubmit={handleAddFormSubmit}>
        {/*Just copy the input tags and contents if need more inputs. Edit as needed. Make sure that name is = to the data's element that is being mapped above */}
        <input className = "rideInputForm"
          type="text"
          name="clientName"
          required="required"
          placeholder="Client Name"
          value={addFormData.clientName}
          onChange={handleAddFormChange}
        ></input>
        <input className = "rideInputForm"
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Client Phone"
          value={addFormData.phoneNumber}
          onChange={handleAddFormChange}
        ></input>
        <input className = "rideInputForm"
          type="text"
          name="address"
          required="required"
          placeholder="Client Address"
          value={addFormData.address}
          onChange={handleAddFormChange}
        ></input>
        <input className = "rideInputForm"
          type="text"
          name="startTime"
          required="required"
          placeholder="Pickup Time"
          value={addFormData.startTime}
          onChange={handleAddFormChange}
        ></input>
        <button className="addRideButton" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddRideForm;
