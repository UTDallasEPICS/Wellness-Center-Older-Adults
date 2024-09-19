import { useState } from "react";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, pattern, value, type, ...inputProps } = props;

  const handleFocus = () => {
    setFocused(true);
  };

  // Use a regular expression for email validation if the field is of type 'email'
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation logic based on type and pattern
  const isValid = type === "email" ? isEmailValid(value) : (!pattern || new RegExp(pattern).test(value));

  return (
    <div className="flex flex-col w-72">
      <label className="font-bold text-sm text-green-800">{label}</label>
      <input
        type={type}
        {...inputProps}
        value={value}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        className="p-4 my-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {focused && !isValid && (
        <span className="font-bold text-xs text-red-500 mt-1">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FormInput;
