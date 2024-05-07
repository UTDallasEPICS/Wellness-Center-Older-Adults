import {useState} from "react";


const AddRideForm = ({handleAddFormSubmit, handleAddFormChange, addFormData}) =>{
 
  const [formData, setFormData] = useState({
    clientName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
  });

      
    
  
  
  return(
    <div className = "addRideFormDiv  ">
      <h2>Add a Ride</h2>
        <form onSubmit={handleAddFormSubmit}>
          {/*Just copy the input tags and contents if need more inputs. Edit as needed. Make sure that name is = to the data's element that is being mapped above */}
          <input 
          type="text" 
          name="clientName" 
          required = "required" 
          placeholder="Enter client's name..."
          value={addFormData.clientName}
          onChange={handleAddFormChange}>
          
          </input>
          <input 
          type="text" 
          name="phoneNumber" 
          required = "required" 
          placeholder="Enter contact number..."
          value={addFormData.phoneNumber}
          onChange={handleAddFormChange}>
          </input>
          <input 
          type="text" 
          name="address" 
          required = "required" 
          placeholder="Enter client's address"
          value={addFormData.address}
          onChange={handleAddFormChange}>
          </input>
          <input 
          type="text" 
          name="startTime" 
          required = "required" 
          placeholder="Enter time of pick-up..."
          value={addFormData.startTime}
          onChange={handleAddFormChange}>
          
          </input>
          <button type="submit">Add</button>
        </form>
      </div>
  );
}

export default AddRideForm;