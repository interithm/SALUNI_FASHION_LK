'use client';

import { useState } from 'react';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    reference: '',
    customer_first_name: '',
    customer_last_name: '',
    customer_phone_number: '',
    customer_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/onepay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data?.data?.gateway?.redirect_url) {
      console.log('Payment success:', data);
      window.location.href = data.data.gateway.redirect_url; // Redirect to the Onepay payment page
    } else {
      console.error('Payment error:', data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />
      <input
        type="text"
        name="reference"
        value={formData.reference}
        onChange={handleChange}
        placeholder="Reference ID"
        required
      />
      <input
        type="text"
        name="customer_first_name"
        value={formData.customer_first_name}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="customer_last_name"
        value={formData.customer_last_name}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        name="customer_phone_number"
        value={formData.customer_phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <input
        type="email"
        name="customer_email"
        value={formData.customer_email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <button type="submit">Pay Now</button>
    </form>
  );
};

export default PaymentPage;
