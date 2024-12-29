//./controllers/verificationController.js
const User = require("../models/User");
const UserVerification = require("../models/UserVerification");
const UserOTPVerification = require("../models/UserOTPVerification");
const bcrypt = require("bcrypt");
const path = require("path");
const {
  sendOTPVerificationEmail,
  sendVerificationEmail,
} = require("../utils/emailUtils");

exports.verifyOTP = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        // No record found
        throw new Error(
          "Account record doesn't exist or has been verified already. Please sign up or log in."
        );
      } else {
        // User OTP record exists
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        // Check if OTP is expired
        if (expiresAt < Date.now()) {
          // User OTP record has expired
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else {
          // Compare the OTP with the hashed OTP
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            // Supplied OTP is wrong
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            // Success
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            res.json({
              status: "VERIFIED",
              message: `User email verified successfully`,
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

exports.resendOTPVerificationCode = async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user details are not allowed");
    } else {
      // Delete existing records and resend
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // User verification record exists, so we proceed
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        // Check if the unique string is expired
        if (expiresAt < Date.now()) {
          // Record has expired, so we delete it
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has expired. Please sign up again";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  let message =
                    "Clearing user with expired unique string failed";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                "An error occurred while clearing expired user verification record";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        } else {
          // Valid record exists, so we validate the user string
          // First, compare the hashed unique string
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                // Strings match
                User.updateOne({ _id: userId }, { verified: true }).then(() => {
                  UserVerification.deleteOne({ userId })
                    .then(() => {
                      res.sendFile(
                        path.join(__dirname, "./../views/verified.html")
                      );
                    })
                    .catch((error) => {
                      console.log(error);
                      let message =
                        "An error occurred while finalizing successful verification.";
                      res.redirect(
                        `/user/verified/error=true&message=${message}`
                      );
                    });
                });
              } else {
                // Existing record but incorrect verification details passed
                let message =
                  "Invalid verification details passed. Check your inbox";
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((error) => {
              let message = "An error occurred while comparing unique strings.";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        // User verification record doesn't exist
        let message =
          "Account record doesn't exist or has been verified already. Please sign up or log in.";
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occurred while checking for existing user verification record";
      res.redirect(`/user/verified/error=true&message=${message}`);
    });
};

/* exports.resendVerificationLink = async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user details are not allowed");
    } else {
      // Delete existing records and resend
      await UserVerification.deleteMany({ userId });
      sendVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: `Verification Link Resend Error. ${error.message}`,
    });
  }
}; */

exports.serveVerifiedPage = (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
};
