"use client";

import { useState } from "react";
import { PrismaClient } from "@prisma/client";
import "app/styles/register.css";
import FormInput from "app/components/FormInput.jsx";
import Header from "app/components/Header.jsx";
const Register = () => {

  const prisma = new PrismaClient();

  const initialState = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    connection: "WCOA-Username-Password"
  };

  const [values, setValues] = useState(initialState);

  const inputs = [
    {
      id:1,
      name:"email",
      type:"email",
      placeholder:"Email",
      errorMessage:"Not a valid email address!",
      label:"Email",
      required: true,
    },
    {
      id:2,
      name:"firstName",
      type:"text",
      placeholder:"First Name",
      errorMessage:"Should only contain letters! (2-25)",
      label:"First Name",
      pattern:"^[A-Za-z']{2,25}$",
      required: true,
    },
    {
      id:3,
      name:"lastName",
      type:"text",
      placeholder:"Last Name",
      errorMessage:"Should only contain letters! (2-25 letters)",
      label:"Last Name",
      pattern:"^[A-Za-z]{2,25}$",
      required: true,
    },
    {
      id:4,
      name:"password",
      type:"password",
      placeholder:"Password",
      errorMessage:"Password should be: 8-25 characters, contain one lowercase and one uppercase letter, and a special character.",
      label:"Password",
      pattern:"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*?+=])[A-Za-z\\d!@#$%^&*?+=]{8,25}$",
      required: true,
    },
    {
      id:5,
      name:"confirmPassword",
      type:"password",
      placeholder:"Confirm Password",
      errorMessage:"Passwords do not match!",
      label:"Confirm Password",
      pattern: values.password,
      required: true,
    },
    ];

  const handleSubmit = async(e) =>{
    
    e.preventDefault();
    
    try{
      const response = await fetch("/api/v2/users", {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(values)
      });

      if(!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('Registration successful!');
      setValues(initialState);
    } catch(error) {
      console.error('Failed to register:', error);
      alert('Registration failed!');

    }

  };

  const onChange =(e)=>{
    setValues({...values, [e.target.name]: e.target.value});
  }
  
  return(
  <div>
    <Header/>
  <div className = "register">
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
    {inputs.map((input)=>(
      <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange}/>
    ))}
    <button>Submit</button>
    </form>
  </div>
  </div>
  );
};

export default Register;