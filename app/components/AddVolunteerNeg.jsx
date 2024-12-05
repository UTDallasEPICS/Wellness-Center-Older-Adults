import React from "react";

const AddVolunteerNeg = ({errorMessage}) => {
  return (
    <div className="bg-red-600 text-white p-2.5 rounded-md flex items-center justify-center">
      {`${errorMessage} `} <span className="ml-1.5">❌</span>
    </div>
  );
};

export default AddVolunteerNeg;
