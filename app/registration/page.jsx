"use client";

import { useState } from "react";
import "app/styles/register.css";
import FormInput from "app/components/FormInput.jsx";
import Header from "app/components/Header.jsx";
const Register = () => {
  const [values, setValues] = useState({
    email:"",
    firstName:"",
    lastName:"",
    password:"",
    confirmPassword:""
  });

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
      errorMessage:"Password should be 6-20 characters",
      label:"Password",
      pattern:"^[A-Za-z0-9!@#$%^&*?+=]{6,20}$",
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

  const handleSubmit = (e) =>{
    e.preventDefault();

  }

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