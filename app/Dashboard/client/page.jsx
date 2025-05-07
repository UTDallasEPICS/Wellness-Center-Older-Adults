"use client";
import React, { useState, useEffect } from 'react';
import ClientInputForm from "/app/components/ClientInputForm.jsx";

export default function Page() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

<<<<<<< Updated upstream
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customer/getCustomer');
      if (!response.ok) {
        throw new Error(`Failed to fetch customer data: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customer data');
      setLoading(false);
    }
  };
=======
>>>>>>> Stashed changes

  useEffect(() => {
    fetchCustomers();
  }, []);

<<<<<<< Updated upstream
  const handleAddCustomerSubmit = (newCustomer) => {
    // Optimistically update the UI by adding the new customer to the state
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    setIsAddCustomerModalOpen(false);
    // toast.success("Customer added successfully!");

    // Ideally, you would also make an API call here to persist the new customer
    fetch('/api/customer/addCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer),
    })
    .then(response => {
      if (!response.ok) {
        // toast.error("Failed to add customer.");
        // Optionally, revert the optimistic update on error
        setCustomers(prevCustomers => prevCustomers.filter(cust => cust !== newCustomer));
        throw new Error('Failed to add customer');
      }
      return response.json();
    })
    .then(data => {
      // Optionally, update the state with the server's response if needed
      // setCustomers(prevCustomers => [...prevCustomers, data]);
      // toast.success("Customer added successfully!");
      // Re-fetch customers to ensure the list is up-to-date
      fetchCustomers();
    })
    .catch(error => {
      console.error('Error adding customer:', error);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading Customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }
=======
  const handleAddCustomerSubmit = (newCustomer) => {
    // Optimistically update the UI by adding the new customer to the state
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    setIsAddCustomerModalOpen(false);
    // toast.success("Customer added successfully!");

    // Ideally, you would also make an API call here to persist the new customer
    fetch('/api/createCustomerAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer),
    })
    .then(response => {
      if (!response.ok) {
        // toast.error("Failed to add customer.");
        // Optionally, revert the optimistic update on error
        setCustomers(prevCustomers => prevCustomers.filter(cust => cust !== newCustomer));
        throw new Error('Failed to add customer');
      }
      return response.json();
    })
    .then(data => {
      // Optionally, update the state with the server's response if needed
      // setCustomers(prevCustomers => [...prevCustomers, data]);
      // toast.success("Customer added successfully!");
      // Re-fetch customers to ensure the list is up-to-date
      fetchCustomers();
    })
    .catch(error => {
      console.error('Error adding customer:', error);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading Customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }
>>>>>>> Stashed changes

  return (
    <div className="w-full min-h-screen bg-white flex flex-col relative"> {/* Main container */}
      <div className="flex flex-row items-center py-8 px-8"> {/* Header */}
        <div className="text-black text-left font-light text-[30px]">
          <h1>Client Page</h1>
        </div>
        <div className="ml-auto pr-6">
          <button
            type="button"
            className="h-[45px] w-[45px] rounded-full text-white bg-black border-none absolute top-2 right-4 z-40 flex items-center justify-center shadow-md"
            onClick={() => setIsAddCustomerModalOpen(true)}
          >
            <span className="material-symbols-rounded">add</span>
          </button>
        </div>
        <div className="pr-6">
          <button type="button" className="h-[45px] w-[45px] rounded-full text-white bg-black border-none">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 text-black px-6 py-4 font-light text-[15px] bg-white border-b border-gray-300 w-full">
        <p>Name</p>
        <p>Address</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Birthdate</p>
      </div>

      {/* Client List Table */}
      <div className="w-full flex flex-col text-black bg-white border-t border-b border-gray-300">
        {customers.map((customer, index) => (
          <div key={index} className="grid grid-cols-5 py-4 border-b border-gray-300 px-6">
            <p>{`${customer.firstName} ${customer.lastName}`}</p>
            <p>{`${customer.streetAddress}, ${customer.city}, ${customer.state} ${customer.zipcode}`}</p>
            <p>{customer.customerEmail}</p>
            <p>{customer.customerPhone}</p>
            <p>{customer.birthdate ? new Date(customer.birthdate).toLocaleDateString() : 'N/A'}</p>
          </div>
        ))}
      </div>

      {/* Conditionally render the ClientInputForm as the modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg">
            <ClientInputForm onSubmit={handleAddCustomerSubmit} onClose={() => setIsAddCustomerModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )};