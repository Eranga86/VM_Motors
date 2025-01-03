import React, { useState } from "react";
import "../styles/editadminprofile.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const EditAdminprofile = () => {
  return (
    <div>
      <Navbar />
      <body>
        <div>
          <div className="header">
            <h1>Edit Your Profile</h1>
          </div>
          <br />
          <div className="container">
            <form className="needs-validation" encType="multipart/form-data">
              <div className="row">
                <div className="left-side">
                  <h1>Update Account</h1>
                  <div className="d-flex justify-content-center">
                    <div className="profile-pic-container"></div>
                  </div>
                  <div className="container">
                    <div className="form-group"></div>
                  </div>
                </div>

                <div className="right-side">
                  <div id="developerFields">
                    <br />
                    {/* First Name */}
                    <div className="form-group">
                      <div className="row">
                        <div className="input-group col-lg-6 mb-2">
                          <label htmlFor="firstName">First Name</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text bg-white px-4 border-md border-right-0">
                                <i className="fa fa-user text-muted"></i>
                              </span>
                            </div>
                            <input
                              id="firstName"
                              type="text"
                              name="firstName"
                              placeholder="First Name"
                              className="form-control bg-white border-left-0 border-md"
                              required
                            />
                          </div>
                        </div>

                        {/* Last Name */}
                        <div className="input-group col-lg-6 mb-2">
                          <label htmlFor="lastName">Last Name</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text bg-white px-4 border-md border-right-0">
                                <i className="fa fa-user text-muted"></i>
                              </span>
                            </div>
                            <input
                              id="lastName"
                              type="text"
                              name="lastName"
                              placeholder="Last Name"
                              className="form-control bg-white border-left-0 border-md"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Messages */}
                    <div className="form-group">
                      <div className="row">
                        <div className="input-group col-lg-6">
                          <p id="firstNameError" style={{ color: "red" }}></p>
                        </div>
                        <div className="input-group col-lg-6">
                          <p id="lastNameError" style={{ color: "red" }}></p>
                        </div>
                      </div>
                    </div>

                    {/* Username Should load*/}
                    <div className="form-group">
                      <div className="row">
                        <div className="input-group col-lg-6 mb-4">
                          <label htmlFor="username">Username</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text bg-white px-4 border-md border-right-0">
                                <i className="fa fa-user text-muted"></i>
                              </span>
                            </div>
                            <input
                              id="username"
                              type="text"
                              name="username"
                              className="form-control bg-white border-left-0 border-md"
                              disabled
                            />
                            <p id="firstNameError" style={{ color: "red" }}></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <input type="hidden" name="user" value="" />
                    <input type="hidden" name="uid" value="" />
                    <input type="hidden" name="did" value="" />

                    {/* Email */}
                    <div className="form-group">
                      <div className="row">
                        <div className="input-group col-lg-12 mb-4">
                          <label htmlFor="email">Email</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text bg-white px-4 border-md border-right-0">
                                <i className="fa fa-envelope text-muted"></i>
                              </span>
                            </div>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              placeholder="Email Address"
                              className="form-control bg-white border-left-0 border-md"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="form-group">
                      <label htmlFor="profilePic">Profile Picture</label>
                      <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        className="form-control-file"
                        required
                      />
                    </div>
                  </div>

                  <br />
                  <div className="form-group text-center">
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        id="createAccountBtn"
                        className="btn btn-primary w-50"
                        name="BecomeaDeveloper"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </body>

      <Footer />
    </div>
  );
};
export default EditAdminprofile;
