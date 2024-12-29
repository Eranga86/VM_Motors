import React from 'react';
import '../styles/billinginfo.css'; // Ensure you have the right path

export default function CusDetails() {
  return (
    <div className="owner-details-container">
      <div className="panel panel-info">
        <div className="panel-heading">Customer Details</div>
        <div className="panel-body">

        <div className="form-group row">
            <div className="col-md-12">
              <strong className="d-block text-left">Country:</strong>
              <input type="text" name="address" className="form-control" />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-6 col-xs-12">
              <strong className="d-block text-left">First Name:</strong>
              <input type="text" name="first_name" className="form-control" />
            </div>
            <div className="col-md-6 col-xs-12">
              <strong className="d-block text-left">Last Name:</strong>
              <input type="text" name="last_name" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
              <strong className="d-block text-left">Email Address:</strong>
              <input type="text" name="address" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12">
              <strong className="d-block text-left">Address:</strong>
              <input type="text" name="email_address" className="form-control" />
            </div>
          </div>
          
          <div className="form-group row">
            <div className="col-md-6 col-xs-12">
              <strong className="d-block text-left">City:</strong>
              <input type="text" name="first_name" className="form-control" />
            </div>
            <div className="col-md-6 col-xs-12">
              <strong className="d-block text-left">Postcode:</strong>
              <input type="text" name="last_name" className="form-control" />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-12">
              <strong className="d-block text-left">Phone Number:</strong>
              <input type="text" name="phone_number" className="form-control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
