import { useState } from "react";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="flex flex-col w-72">
      <label className="font-bold text-sm text-green-800">{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        focused={focused.toString()}
        className="p-4 my-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {inputProps.value.trim() !== "" && (
        <span className="font-bold text-xs text-red-500 mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

export default FormInput;
