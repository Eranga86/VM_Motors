//../utils/emailUtils.js
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const UserOTPVerification = require("../models/UserOTPVerification");
const PasswordReset = require("../models/PasswordReset");
const UserVerification = require("../models/UserVerification");

// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// Testing success
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email service is ready:", success);
  }
});

const development = "http://localhost:3000/";
const production = "";
const currentUrl = process.env.NODE_ENV ? production : development;

exports.sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    // mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup process.</p><p>This code <b>expires in 1 hour</b>`,
    };

    // Hash the OTP
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    // save the otp record
    await newOTPVerification.save();
    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({
      status: "PENDING",
      message: "Verification email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};
exports.sendOrderConfirmationEmail = async (order) => {
  const mailOptions = {
    from: "evenmanagement@hotmail.com", // sender address
    to: order.customer.email, // customer's email address
    subject: "Order Confirmation", // email subject
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${order._id}</p>
      <p>Total Amount: ${order.totalAmount}</p>
      <!-- Add more order details as needed -->
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully!");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};
/* exports.sendVerificationEmail = async ({ _id, email }, res) => {
  const uniqueString = uuidv4() + _id;

  // Email options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email to complete the signup and login into your account.</p><p>This link <b>expires in one hour.</b></p><p>Press <a href=${
      currentUrl + "user/verify/" + _id + "/" + uniqueString
    }>here</a> to proceed</p>`,
  };

  // Hash the uniqueString
  const saltRounds = 10;
  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);

    // Save verification data
    const newVerification = new UserVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // Expires in 1 hour
    });

    await newVerification.save();
    await transporter.sendMail(mailOptions);

    res.json({
      status: "PENDING",
      message: "Verification email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "Couldn't save verification email data!",
    });
  }
}; */

exports.sendResetEmail = async (user, redirectUrl, res) => {
  try {
    const resetString = uuidv4() + user._id;

    // Delete existing reset records
    try {
      await PasswordReset.deleteMany({ userId: user._id });
    } catch (error) {
      console.error("Error clearing existing password reset records:", error);
      return res.status(500).json({
        status: "FAILED",
        message: "Clearing existing password reset records failed",
      });
    }

    // Mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Password Reset",
      html: `<p>We heard that you lost the password.</p> <p>Don't worry, use the link below to reset it.</p> <p>This link <b>expires in 60 minutes</b>.</p><p>Press <a href=${
        redirectUrl + "/" + user._id + "/" + resetString
      }>here</a> to proceed.</p>`,
    };

    // Hash the resetString
    const saltRounds = 10;
    try {
      const hashedResetString = await bcrypt.hash(resetString, saltRounds);

      // Save new password reset record
      const newPasswordReset = new PasswordReset({
        userId: user._id,
        resetString: hashedResetString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
      });
      await newPasswordReset.save();
    } catch (error) {
      console.error("Error saving password reset data:", error);
      return res.status(500).json({
        status: "FAILED",
        message: "Couldn't save password reset data!",
      });
    }

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      res.json({
        status: "PENDING",
        message: "Password reset email sent",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return res.status(500).json({
        status: "FAILED",
        message: "An error occurred while sending the reset email.",
      });
    }
  } catch (error) {
    console.error("Unexpected error occurred:", error);
    res.status(500).json({
      status: "FAILED",
      message: "An unexpected error occurred.",
    });
  }
};
