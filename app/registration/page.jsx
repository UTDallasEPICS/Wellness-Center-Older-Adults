"use client";

import { useState, useEffect } from "react";
import { PrismaClient } from "@prisma/client";
import "/app/styles/register.css";
import FormInput from "/app/components/FormInput.jsx";
import Header from "/app/components/Header.jsx";
const handleRedirect = () => {
  window.location.href = '/Dashboard/admin';
}

const Register = () => {
  const prisma = new PrismaClient();


  const initialState = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    connection: "WCOA-Username-Password",
  };

  const [values, setValues] = useState(initialState);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Check if passwords match whenever they change
  useEffect(() => {
    setPasswordsMatch(values.password === values.confirmPassword);
  }, [values.password, values.confirmPassword]);

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "Not a valid email address!",
      label: "Email",
      required: true,
    },
    {
      id: 2,
      name: "firstName",
      type: "text",
      placeholder: "First Name",
      errorMessage: "Should only contain letters! (2-25)",
      label: "First Name",
      pattern: "^[A-Za-z']{2,25}$",
      required: true,
    },
    {
      id: 3,
      name: "lastName",
      type: "text",
      placeholder: "Last Name",
      errorMessage: "Should only contain letters! (2-25 letters)",
      label: "Last Name",
      pattern: "^[A-Za-z]{2,25}$",
      required: true,
    },
    {
      id: 4,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage: "Password should be: 8-25 characters, contain one lowercase and one uppercase letter, and a special character.",
      label: "Password",
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*?+=])[A-Za-z\\d!@#$%^&*?+=]{8,25}$",
      required: true,
    },
    {
      id: 5,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords do not match!",
      label: "Confirm Password",
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      return;
    }

    try {
      const response = await fetch("/api/v2/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      
      alert('Registration successful!');
      setValues(initialState);

      handleRedirect();
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Registration failed!');
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-[80vh] bg-[#fbfcf8]">
        <form onSubmit={handleSubmit} className="bg-gray-300 px-14 py-6 rounded-lg">
          <h1 className="text-center text-2xl mb-4">Register</h1>
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          ))}
          {!passwordsMatch && (
            <span className="font-bold text-xs text-red-500 mt-1">Passwords do not match!</span>
          )}
         <button 
            type="submit" 
            className="w-full h-[50px] px-4 bg-[#419902] text-white font-bold text-lg cursor-pointer mt-4 mb-8 rounded-full">
            Submit
        </button>
        </form>
      </div>
    </div>
  );
};

export default Register;