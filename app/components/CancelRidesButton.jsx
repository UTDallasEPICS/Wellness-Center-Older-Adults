import { useState } from 'react'

const CancelRidesButton = () => {

    const [isPromptVisible, setPromptVisible] = useState(false);


    const handleCancelClick = () => {
        setIsPromptVisible(true);
    };
    
      
    const handleConfirm = () => {
        setIsPromptVisible(false);
        // Add logic here to cancel the ride (e.g., API call to cancel the ride)
        alert('Ride cancelled!');
    };
    
      // Function to handle denial of ride cancellation
    const handleDeny = () => {
        setIsPromptVisible(false);
    };

    


    return (
        <div>
          <button onClick={handleCancelClick}>Cancel Ride</button>
          
          {isPromptVisible && (
            <div className="cancel-prompt">
              <p>Are you sure you want to cancel the ride?</p>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleDeny}>Deny</button>
            </div>
          )}
        </div>
      );


};

export default CancelRidesButton;