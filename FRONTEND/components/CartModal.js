import React from 'react';
import Sparepart5 from '../assests/spare_part_img5.jpg'
import '../styles/cartmodal.css';

const CartModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-custom">
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="modal-content">
          <div className="modal-header">
            <img src={Sparepart5} className="modal-img" alt="Spare Part" />
            <div>
              <h3>Front Buffer</h3>
              <p>Rs.3200.00</p>
            </div>
          </div>
          <hr />
          <div className="modal-body">
            <div className="total-price">
              <span>Total Price:</span>
              <span className="price">Rs.3200.00</span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="view-cart-btn">View Cart</button>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
