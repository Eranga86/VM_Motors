import React from 'react';
import SparePartImage1 from '../assests/compreesor.jpg';
import SparePartImage2 from '../assests/spare_part_img3.jpg';
import '../styles/ordertable.css';

const orders = [
    {
      orderNumber: '00001',
      productImage: SparePartImage1,
      productName: 'Compressor',
      price: 'LKR.1500',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      purchaseDate: '2024-08-01',
    },
    {
      orderNumber: '00006',
      productImage: SparePartImage2,
      productName: 'Condensor',
      price: 'LKR.3000',
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending',
      purchaseDate: '2024-06-15',
    },
  
  ];

const OrderTable = () => (
  <div className="orders">
    <h2>Orders</h2>
    <table className="order-table">
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Product Image</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Payment Status</th>
          <th>Order Status</th>
          <th>Purchase Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={index}>
            <td>{order.orderNumber}</td>
            <td><img src={order.productImage} alt="Product" className="product-image" /></td>
            <td>{order.productName}</td>
            <td>{order.price}</td>
            <td className={`status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</td>
            <td className={`status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</td>
            <td>{order.purchaseDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
