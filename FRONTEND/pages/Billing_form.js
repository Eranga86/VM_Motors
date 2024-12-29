import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useCheckout } from "../context/CheckoutContext";
import { CartContext } from "../context/CartContext";


const BillingForm = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [refNo, setRefNo] = useState(1); // Initialize total price state
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phonenumber: '',
    email: '',
    address: '',
    sadress: '',
    badress:''
  });

  const { user } = useContext(UserContext);
  const { isCheckoutStarted, endCheckout } = useCheckout();
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  useEffect(() => {

    if (!user) {
      navigate("/admin_login", { replace: true });
      return;
    }

    if (!isCheckoutStarted) {
      console.log("Checkout not started, redirecting to cart");
      navigate("/", { replace: true });
      return;
    }
    // Retrieve cartItems and totalPrice from sessionStorage
    const cartItemsStr = sessionStorage.getItem('cartItems');
    const totalPriceStr = sessionStorage.getItem('totalPrice');

    if (cartItemsStr && totalPriceStr) {
      const cartItems = JSON.parse(cartItemsStr);
      setCartItems(cartItems);
      setTotal(parseFloat(totalPriceStr));
      const newRandomNumber = Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100
      setRefNo(newRandomNumber);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const processing_checkout = async (orderDetails) => {
    try {
      // Add order details to the backend
       const response3 = await axios.post('http://localhost:3001/orders/post', orderDetails);
      console.log('Order details added:', response3.data);

      const response4 = await axios.get(`http://localhost:3001/orders/order_details/${orderDetails.refferenceNo}`);
      console.log('Order details:', response4.data);

      

      const paymentData = {
        fname: formData.fname,
        lname: formData.lname,
        phonenumber: formData.phonenumber,
        email: formData.email,
        userid:user.id,
        totalprice: total,
        orderid: response4.data._id,
        cartItems
      };
      console.log('Payment data:',paymentData );

      const paymentResponse = await axios.post('http://localhost:3001/proceedToCheckout/pay', paymentData);
      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.data && paymentResponse.data.redirect_url) {
        window.location.href = paymentResponse.data.redirect_url;
      } else {
        console.error('Redirect URL not found in response:', paymentResponse.data);
      }
    } catch (error) {
      console.error('Error processing payment or submitting data:', error.response ? error.response.data : error.message);
      // Handle error or notify user accordingly
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderDetails = {
      customerID: user.id,
      refferenceNo: refNo,
      shippingAddress: formData.sadress,
      billingAddress: formData.badress,
      orderTotal: total,
      products: cartItems.map(item => ({
        productID: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity
      }))
    };

    processing_checkout(orderDetails);
  };

  return (
    <div>
      <div className='card3' style={{
    border: '1px solid #ccc',        // Corrected syntax with quotes
    borderRadius: '8px',             // CamelCase for borderRadius
    backgroundColor: '#f8f9fa',      // CamelCase for backgroundColor
    padding: '20px',
    margin: '20px',
    width: 'auto',                   // Full screen width
    boxSizing: 'border-box',         // Ensure padding is included in width calculation
   
  }}>
      <form onSubmit={handleSubmit}>

      <h2
  style={{
    marginBottom: '20px', 
    textAlign: 'center',   
    fontWeight: 'bold',   
  }}
>
  Shipping Details
</h2>

      <div className="form-group row">
       <div className="col-md-12">
         <strong className="d-block text-left">First Name:</strong>
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            className="form-control"
            value={formData.fname}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className="form-group row">
       <div className="col-md-12">
         <strong className="d-block text-left">Last Name:</strong>
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            className="form-control"
            value={formData.lname}
            onChange={handleChange}
            required
          />
        </div>
        </div>

        <div className="form-group row">
       <div className="col-md-12">
         <strong className="d-block text-left">Phone Number:</strong>
          <input
            type="tel"
            name="phonenumber"
            placeholder="Phone Number"
            className="form-control"
            pattern="^(?:7|0|(?:\+94))[0-9]{9,10}$"
            value={formData.phonenumber}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className="form-group row">
       <div className="col-md-12">
         <strong className="d-block text-left">Email Name:</strong>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className="form-group row">
       <div className="col-md-12">
         <strong className="d-block text-left">Shipping Address:</strong>
          <input
            type="text"
            name="sadress"
            placeholder="Shipping address"
            className="form-control"
            value={formData.sadress}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className="form-group row">
       <div className="col-md-12">
         <strong className="d-block text-left">Billing Address:</strong>
          <input
            type="text"
            name="badress"
            placeholder="Billing address"
            className="form-control"
            value={formData.badress}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',  // Center the button horizontally
            marginTop: '20px',        // Optional: Add some margin above the button
          }}
        >
        <button
  style={{
    backgroundColor: '#081F62',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    width: '600px',
    
  }}
  type="submit"
>
PAY VIA ONEPAY
</button>
</div>
      </form>
      </div>
    </div>
  );
};

export default BillingForm;
