import React, { useState } from 'react';
import OrderTable from '../components/OrderTable';
import Footer from "../components/Footer";
import SparePartImage from '../assests/spare_part_img4.jpg';
import Profile from '../assests/profile.png';
import VehiProfImage from '../assests/VG_busss.png';
import CommunityImage from '../assests/VG_Community.png';
import NotificationImage from '../assests/VG_notification.png';
import '../styles/CRMSystem.css';
import { Link } from 'react-router-dom';

const CRMSystem = () => {
  const [activeSection, setActiveSection] = useState('orders');

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <OrderSection />;
      case 'editProfile':
        return <EditProfileSection />;
      case 'virtualGarage':
        return <VirtualGarageSection />;
      default:
        return <OrderSection />;
    }
  };

  return (
    <div>
    <div className="crm-container">
      <div className="sidebar">
        <div className="user-profile">
        <img src={Profile} className="img-fluid" alt="Profile " />
          <p>User Name</p>
        </div>
        <button onClick={() => setActiveSection('orders')}>Order</button>
        <button onClick={() => setActiveSection('editProfile')}>Edit Profile</button>
        <button onClick={() => setActiveSection('virtualGarage')}>Virtual Garage</button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
    <Footer className="footer">
        <Footer/>
      </Footer>
    </div>
  );
};

const OrderSection = () => (
  <div>
    <OrderTable/>
  </div>
);

const EditProfileSection = () => (
  <div className="edit-profile">
    <div className="signup-box">
      
      {/* Render edit profile form here */}
      <form className="edit-profile-form">
        <div className="profile-container">
        <h2>Edit Profile</h2>
        <div className="profile-picture">
        <img src={Profile} className="img-fluid" alt="Profile " />
          <input type="file" />
        </div>
        </div>
        <div className="form-group row">
          <div className="col-md-6 col-xs-12">
            <strong className="d-block text-left">First Name:</strong>
            <input type="text" name="first_name" className="form-control" required />
          </div>
          <div className="col-md-6 col-xs-12">
            <strong className="d-block text-left">Last Name:</strong>
            <input type="text" name="last_name" className="form-control" required />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-6 col-xs-12">
            <strong className="d-block text-left">Email:</strong>
            <input type="text" name="email_address" className="form-control" required />
          </div>
          <div className="col-md-6 col-xs-12">
            <strong className="d-block text-left">Phone Number:</strong>
            <input type="text" name="phone_number" className="form-control" required />
          </div>
        </div>
        
        <div className="form-group row">
          <div className="col-md-12 col-xs-12">
            <strong className="d-block text-left">Address:</strong>
            <input type="text" name="address" className="form-control" required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  </div>
);

const VirtualGarageSection = () => (
  <div>
      <h2 className="centerBold">
      Welcome to Virtual Garage!
    </h2>
      <div className="virtual-garage-container">
        <div className="feature-container">
          <div className="feature">
            <img src={VehiProfImage} className="img-fluid" alt="vehiprofile" />
            <h3>Vehicle Profiles</h3>
            <p>Customers can create profiles for their vehicles, adding details like model, year, and recent purchases.</p>
          </div>
        </div>
        <div className="feature-container">
          <div className="feature">
            <img src={CommunityImage} className="img-fluid" alt="community" />
            <h3>Community</h3>
            <p>Customers can share their vehicle profiles and comments, building a strong community and loyalty with the company.</p>
          </div>
        </div>
        <div className="feature-container">
          <div className="feature">
            <img src={NotificationImage} className="img-fluid" alt="notification" />
            <h3>Notifications</h3>
            <p>Customers receive notifications about upcoming repairs and services, enhancing their experience with timely reminders.</p>
          </div>
        </div>
      </div>
      
      <Link to="/virtualGarage"><button className="virtual-garage-btn">Go to Virtual Garage</button></Link>
                      
      
    </div>
);

export default CRMSystem;