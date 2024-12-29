// FRONTEND/src/pages/SignupAdmin.js

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import welcomeImage from "../assests/reg.gif";
import "../styles/signup.css";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const Modal = ({ message, onClose, autoClose = false, style }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    ...style,
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3>{message}</h3>
        {!autoClose && <button onClick={onClose}>OK</button>}
      </div>
    </div>
  );
};

export default function SignupAdmin() {
  const { signup } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [signupStatus, setSignupStatus] = useState(null);

  console.log(
    "Rendering SignupAdmin. Error:",
    error,
    "Success:",
    successMessage
  );

  useEffect(() => {
    if (userId && !showVerificationStep) {
      console.log("Setting showVerificationStep to true");
      setTimeout(() => {
        setShowVerificationStep(true);
      }, 2000);
    }
  }, [userId, showVerificationStep]);

  const handleChange = (e) => {
    console.log(`Field ${e.target.name} changed to:`, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    errors.firstName = validateName(formData.firstName, "First name");

    // Last Name validation
    errors.lastName = validateName(formData.lastName, "Last name");

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)
    ) {
      errors.password =
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      errors.address = "Please enter a valid address (at least 5 characters)";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    // If there are any errors, set the error state and return false
    if (Object.keys(newErrors).length > 0) {
      console.log("Form validation failed. Errors:", newErrors);
      setErrors(newErrors);
      setError(Object.values(newErrors).join(" "));
      return false;
    }

    // If no errors, clear any existing error and return true
    console.log("Form validation passed");
    setErrors({});
    setError("");
    return true;
  };

  // Helper function for name validation
  const validateName = (name, fieldName) => {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      return `${fieldName} is required`;
    } else if (/[\s0-9]/.test(trimmedName)) {
      return `${fieldName} should not contain spaces or numbers`;
    } else if (trimmedName.length < 2) {
      return `${fieldName} should be at least 2 characters long`;
    } else if (trimmedName.length > 50) {
      return `${fieldName} should not exceed 50 characters`;
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        error = validateName(
          value,
          name === "firstName" ? "First name" : "Last name"
        );
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (
          !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
        ) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        } else if (
          !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)
        ) {
          error =
            "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character";
        }
        break;
      case "address":
        if (!value.trim()) {
          error = "Address is required";
        } else if (value.trim().length < 5) {
          error = "Please enter a valid address (at least 5 characters)";
        }
        break;
      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle submit called");
    setError("");
    setSuccessMessage("");
    if (!validateForm()) {
      console.log("Form validation failed, not submitting");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Sending signup request with data:", formData);
      const response = await api.post("/user/signup", formData);
      console.log("API Response:", response); // Debugging line
      setSignupStatus(response.data.status);

      switch (response.data.status) {
        case "PENDING":
          console.log("Signup pending, user ID:", response.data.data.userId);
          setUserId(response.data.data.userId);
          setShowVerificationModal(true);
          //setSuccessMessage("Please check your email for verification.");
          break;
        case "SUCCESS":
          console.log("Signup successful");
          setSuccessMessage("Signup successful! You can now log in.");
          // Optionally, you could automatically log the user in here
          // await login(formData.email, formData.password);
          break;
        default:
          setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      console.error("Response data:", error.response?.data);
      setError(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerification = async (e) => {
    e.preventDefault();
    console.log("Handle verification called");
    setError("");
    setSuccessMessage("");
    setIsVerifying(true);

    if (!otp.trim()) {
      console.log("OTP is empty");
      setError("Please enter the verification code.");
      setIsVerifying(false);
      return;
    }

    try {
      console.log("Sending verification request");
      const response = await api.post("/user/verifyOTP", {
        userId: userId,
        otp,
      });
      console.log("Verification response:", response);
      if (response.data.status === "VERIFIED") {
        console.log("Verification successful");
        setShowSuccessModal(true);
      } else {
        console.log("Verification failed");
        setError("Verification failed: " + (response.data.message || ""));
      }
    } catch (error) {
      console.error("Verification error:", error);
      console.error("Response data:", error.response?.data);
      setError(
        `Verification failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    console.log("Resend OTP called");
    setIsResending(true);
    try {
      console.log("Sending resend OTP request");
      const response = await api.post("/user/resendOTPVerificationCode", {
        userId,
        email: formData.email,
      });
      console.log("Resend OTP response:", response);
      if (response.data.status === "PENDING") {
        setShowResendModal(true);
        setOtp("");
      } else {
        setError("Failed to resend verification code:" + response.data.message);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      console.error("Response data:", error.response?.data);
      setError("Failed to resend: " + error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <div className="signup-container">
        <div className="signup-box">
          <div className="left-part">
            <img src={welcomeImage} alt="Welcome" className="welcome-image" />
            <div className="welcome-text">
              <h2>Welcome to V & M Motors!</h2>
            </div>
          </div>
          <div className="right-part">
            <div className="form-container">
              <h2>{showVerificationStep ? "Verify Email" : "Sign Up"}</h2>
              {error && (
                <div
                  className="error-message"
                  style={{ color: "red", marginBottom: "10px" }}
                >
                  {error}
                </div>
              )}
              {successMessage && (
                <div
                  className="success-message"
                  style={{ color: "green", marginBottom: "10px" }}
                >
                  {successMessage}
                </div>
              )}

              {!showVerificationStep ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <div className="col-md-6 col-xs-12">
                      <strong className="d-block text-left">First Name:</strong>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.firstName && (
                        <div className="invalid-feedback">
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-xs-12">
                      <strong className="d-block text-left">Last Name:</strong>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.lastName && (
                        <div className="invalid-feedback">
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <strong className="d-block text-left">
                        Email Address:
                      </strong>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <strong className="d-block text-left">Password:</strong>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <strong className="d-block text-left">Address:</strong>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <strong className="d-block text-left">
                        Phone Number:
                      </strong>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.phoneNumber ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.phoneNumber && (
                        <div className="invalid-feedback">
                          {errors.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="signup-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerification}>
                  <div className="form-group">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter verification code"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="verify-button"
                    disabled={isVerifying || isResending}
                  >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </button>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isVerifying || isResending}
                  >
                    {isResending ? "Sending..." : "Resend Verification Code"}
                  </button>
                </form>
              )}
            </div>
            <br />
            <p>
              Already have an account?{" "}
              <a href="/admin_login" className="signin-link">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
      {showVerificationModal && (
        <Modal
          message={
            signupStatus === "PENDING"
              ? "Verification email sent successfully. Please check your email and verify your account."
              : "Signup successful! You can now log in."
          }
          onClose={() => {
            setShowVerificationModal(false);
            if (signupStatus === "PENDING") {
              setShowVerificationStep(true);
            }
          }}
        />
      )}
      {/*       {error && <ErrorMessage message={error} />} */}

      {showResendModal && (
        <Modal
          message="New verification code sent. Please check your email."
          onClose={() => setShowResendModal(false)}
        />
      )}

      {showSuccessModal && (
        <Modal
          message="Verification successful. Redirecting to login..."
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/admin_login");
          }}
          autoClose={true}
        />
      )}
    </div>
  );
}
