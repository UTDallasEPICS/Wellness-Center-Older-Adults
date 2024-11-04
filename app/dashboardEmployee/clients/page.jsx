"use client";
import React, { useState, useEffect } from 'react';
import { NextResponse } from 'next/server';
import ClientInputForm from "/app/components/ClientInputForm.jsx";

export default function Page() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customer');
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
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
    fetchCustomers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <div className="flex flex-row items-center py-8 px-8">
        <div className="text-black text-left font-light text-[30px]">
          <h1>Client Page</h1>
        </div>
        <div className="ml-auto pr-6">
          <ClientInputForm />
        </div>
        <div className="pr-6">
          <button type="button" className="h-[45px] w-[45px] rounded-full text-white bg-black border-none">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
      </div>

      {/* Client List Header */}
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
            <p>{`${customer.streetAddress}, ${customer.city}, ${customer.state}, ${customer.zipcode}`}</p>
            <p>{customer.customerEmail}</p>
            <p>{customer.customerPhone}</p>
            <p>{customer.birthdate ? new Date(customer.birthdate).toLocaleDateString() : 'N/A'}</p>
            </div>
        ))}
      </div>
    </div>
  );
}
