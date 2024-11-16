'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { formatPrice } from "@utils/price";
import Image from 'next/image';
import './Styles/cart.css';
import { productOrder } from '@utils/v1/productorder';
import { handleCustomerFormSubmit } from '@utils/v1/customerhandler';
// import { handlePaymentFormSubmit } from '@utils/paymenthandler';
import { generateCustomId } from '@utils/v1/idhandler';
import LoadingOverlay from '../components/common/OrderLoading';
import { handlePlaceNewOrder } from '@utils/v2/handlePlaceNewOrder'

interface CartItem {
  UUID: string;
  Item_Name: string;
  Sales_Price: number;
  quantity: number;
  imageUrl: string;
  imageAlt: string;
  selectedcolor: string;
  selectedsize: string;
}

interface BillingDetails {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  number: number;
  email: string;
}
interface PaymentDetails {
  name: string;
  test: string;
  email: string;
  total: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gateway' | 'koko'>('cod');
  const { user } = useUser();
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    address: '',
    city: '',
    postalCode: '',
    number: 0
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    name: user?.fullName || '',
    test: 'test array',
    email: user?.primaryEmailAddress?.emailAddress || '',
    total: 0,
  })
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onlinePaymentData, setOnlinePaymentData] = useState({
    amount: 0,
    reference: '1256789075',
    customer_first_name: user?.firstName,
    customer_last_name: user?.lastName,
    customer_phone_number: '0704894572',
    customer_email: user?.primaryEmailAddress?.emailAddress,
  });
  useEffect(() => {
    const itemsString = localStorage.getItem('Items');
    if (itemsString) {
      const storedItems = JSON.parse(itemsString);
      setCartItems(storedItems);
    }

    const storedDetails = localStorage.getItem('BillingDetails');
    if (storedDetails) {
      setBillingDetails(JSON.parse(storedDetails));
    }

    const storedDetailsPayment = localStorage.getItem('BillingDetials');
    if (storedDetailsPayment) {
      setPaymentDetails(JSON.parse(storedDetailsPayment))
    }
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    localStorage.setItem('Items', JSON.stringify(items));
  };

  // update payment details in payment table

  useEffect(() => {
    const { rawTotal } = calculateTotalPrice();
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      total: rawTotal,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);  // Updates only when cartItems change

  //update amount tab in online payment gateway

  useEffect(() => {
    const { rawTotal } = calculateTotalPrice();
    setOnlinePaymentData((prevDetails) => ({
      ...prevDetails,
      amount: rawTotal,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);  // Updates only when cartItems change

  const handleQuantityChange = (UUID: string, quantity: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.UUID === UUID ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      updateLocalStorage(updatedItems);
      return updatedItems;
    });
  };

  const handleRemoveItem = (UUID: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.UUID !== UUID);
      updateLocalStorage(updatedItems);
      return updatedItems;
    });
  };

  const calculateTotalPrice = () => {
    // Calculate the total without formatting
    const rawTotal = cartItems.reduce((total, item) => total + item.Sales_Price * item.quantity, 0) + 0;

    // Format the total for display
    const formattedTotal = formatPrice(rawTotal);

    // Return both values if needed
    return { rawTotal, formattedTotal };
  };


  // const handlePlaceOrder = async () => {
  //   setLoading(true);

    // try {
    //   if (paymentMethod === 'cod') {
    //     console.log('COD:', billingDetails);
    //     // Wrapping in Promises to ensure async behavior
    //     await Promise.resolve(productOrder(cartItems));
    //     // await Promise.resolve(handleCustomerFormSubmit(billingDetails, paymentDetails));
    //     console.log('cartItems:', cartItems);
    //     return; // Exit to avoid setting loading state again immediately
    //   }
    //   else if (paymentMethod === 'koko') {
    //     await Promise.resolve(handleCustomerFormSubmit(billingDetails, paymentDetails));
    //     window.location.href = '/koko-payment-gateway';
    //     return; // Exit to avoid setting loading state again
    //   }
    //   else {
    //     console.log(onlinePaymentData);
    //     const response = await fetch('/api/onepay', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(onlinePaymentData),
    //     });

    //     const data = await response.json();

    //     if (data?.data?.gateway?.redirect_url) {
    //       console.log('Payment success:', data);
    //       await handleCustomerFormSubmit(billingDetails, paymentDetails);
    //       window.location.href = data.data.gateway.redirect_url;
    //       return; // Exit to avoid setting loading state again
    //     } else {
    //       console.error('Payment error:', data);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Order error:', error);
    // } finally {
    //   setLoading(false);
    // }
  // };




  const [emailInput, setEmailInput] = useState(user?.primaryEmailAddress?.emailAddress || '');

  useEffect(() => {
    // Set initial billing details when the user changes
    setBillingDetails(prev => ({
      ...prev,
      email: user?.primaryEmailAddress?.emailAddress || '',
    }));
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });

    if (name === 'number') {
      setOnlinePaymentData({ ...onlinePaymentData, customer_phone_number: value });
    }
  };

  const handleFormSubmit = () => {
    localStorage.setItem('BillingDetails', JSON.stringify(billingDetails));
    setIsFormVisible(false);

  };

  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  // Render other components here if loading is true


  return (
    <div className="cart-container">

      {/* Shopping Cart */}
      <div className="cart-item-container">
        <h1 className="cart-title">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {cartItems.map(item => (
                <li key={item.UUID} className="cart-item">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="cart-item-image"
                    width={100}
                    height={100}
                    priority
                  />
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.Item_Name}</p>
                    <p className="cart-item-info">Price: {formatPrice(item.Sales_Price)}</p>
                    <p className="cart-item-info">Color: {item.selectedcolor}</p>
                    <p className="cart-item-info">Size: {item.selectedsize}</p>
                    <div className="cart-item-actions">
                      <button
                        className="cart-quantity-button"
                        onClick={() => handleQuantityChange(item.UUID, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="cart-quantity-text">{item.quantity}</span>
                      <button
                        className="cart-quantity-button"
                        onClick={() => handleQuantityChange(item.UUID, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="cart-remove-button"
                        onClick={() => handleRemoveItem(item.UUID)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={16}
                          height={16}
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h3.5V.5a.5.5 0 0 1 1 0V1h3V.5a.5.5 0 0 1 1 0V1H13a1 1 0 0 1 1 1v1zM4.118 4l.81 8.106A1 1 0 0 0 5.986 13h4.028a1 1 0 0 0 .998-.894l.81-8.106H4.118z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="card  w-full  mt-8">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Order Summary</h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center ">
                    <span className="text-lg">Delivery Fee:</span>
                    <span className="text-lg font-semibold">400.00</span>
                  </div>
                  <span className="text-xs  text-gray-600 mb-3">
                    1-4 Business Day Delivery | Trans Express Delivery
                  </span>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {calculateTotalPrice().formattedTotal}
                    </span>
                  </div>
                </div>


                <div className="divider"></div>

                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

                <div className="space-y-2">
                  {[
                    { id: 'cod' as 'cod', label: 'Cash on Delivery' },
                    { id: 'gateway' as 'gateway', label: 'Online Payment' },
                    { id: 'koko' as 'koko', label: 'Koko Payment' }
                  ].map((option) => (
                    <div key={option.id} className="form-control">
                      <label className="label cursor-pointer justify-start space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="radio radio-primary"
                          checked={paymentMethod === option.id}
                          onChange={() => setPaymentMethod(option.id)}
                        />
                        <span className="label-text">{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    onClick={() => handlePlaceNewOrder(billingDetails , cartItems ,onlinePaymentData , paymentMethod)}
                    className="btn btn-primary btn-block"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Billing Details */}
      <div className="billing-details-container">
        <h2 className="billing-details-title">Billing Details</h2>
        {user ? (
          <div className="billing-details-content">
            {!isFormVisible ? (
              <>
                <ul className="billing-details-list">
                  <li className="billing-details-item">
                    <strong>Name :</strong>
                    <span className="billing-details-item-value">{billingDetails.name || 'User'}</span>
                  </li>
                  <li className="billing-details-item">
                    <strong>Email :</strong>
                    <span className="billing-details-item-value">{user.primaryEmailAddress?.emailAddress}</span>
                  </li>
                  <li className="billing-details-item">
                    <strong>Address :</strong>
                    <span className="billing-details-item-value">{billingDetails.address || 'Not provided'}</span>
                  </li>
                  <li className="billing-details-item">
                    <strong>Phone Number :</strong>
                    <span className="billing-details-item-value">{billingDetails.number || 'Not provided'}</span>
                  </li>
                  <li className="billing-details-item">
                    <strong>City :</strong>
                    <span className="billing-details-item-value">{billingDetails.city || 'Not provided'}</span>
                  </li>
                  <li className="billing-details-item">
                    <strong>Postal Code :</strong>
                    <span className="billing-details-item-value">{billingDetails.postalCode || 'Not provided'}</span>
                  </li>

                </ul>
                <button
                  className="billing-edit-button"
                  onClick={() => setIsFormVisible(true)}
                >
                  Edit Details
                </button>
              </>
            ) : (
              <>
                <div className="billing-form">
                  <div>
                    <label htmlFor="name" className="billing-form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={billingDetails.name}
                      onChange={handleInputChange}
                      className="billing-form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="billing-form-label">Email</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={emailInput} // Use the local email input state
                      onChange={handleInputChange} // Handles input changes
                      readOnly // Makes the input read-only
                      className="billing-form-input"
                    />

                  </div>
                  <div>
                    <label htmlFor="address" className="billing-form-label">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={billingDetails.address}
                      onChange={handleInputChange}
                      className="billing-form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="billing-form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={billingDetails.city}
                      onChange={handleInputChange}
                      className="billing-form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="billing-form-label">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={billingDetails.postalCode}
                      onChange={handleInputChange}
                      className="billing-form-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="billing-form-label">Mobile Number</label>
                    <input
                      type="number"
                      id="number"
                      name="number"
                      value={billingDetails.number}
                      onChange={handleInputChange}
                      className="billing-form-input"
                    />
                  </div>
                </div>
                <button
                  className="billing-save-button"
                  onClick={handleFormSubmit}
                >
                  Save
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="signed-out-message">Please sign in to view your details.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
