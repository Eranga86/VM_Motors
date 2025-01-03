import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Admin from "../assests/admin.png"; // Corrected typo from 'assests' to 'assets'
import "../styles/loginad.css";
import { Outlet, Link } from "react-router-dom";

const LoginAd = () => {
  return (
    <div>
      <Navbar />
      <div className="owner-details-container">
        <div className="panel panel-info">
          <div className="panel-heading">Login Here</div>
          <div className="panel-body">
            <div className="form-group row">
              <img src={Admin} alt="Admin" width="300px" height="300px" />{" "}
              {/* Corrected image width */}
            </div>
            <div className="form-group row">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button type="button" className="btn btn-outline-dark">
                  Admin
                </button>
                <button type="button" className="btn btn-outline-dark">
                  Customer
                </button>
                <button type="button" className="btn btn-outline-dark">
                  Supplier
                </button>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-12">
                <strong className="d-block text-left">Username:</strong>
                <input type="text" name="" className="form-control" />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-12">
                <strong className="d-block text-left">Password:</strong>
                <input type="text" name="" className="form-control" />
              </div>
            </div>
          </div>

          <div className="form-group row">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-dark">
                Login
              </button>
            </div>
          </div>
          <p>
            If you don't have an account, please{" "}
            <Link to="/sign_up">Signup</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginAd;
