//./controllers/passwordResetController.js
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const bcrypt = require("bcrypt");
const { sendResetEmail } = require("../utils/emailUtils");

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email, redirectUrl } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "No account with the supplied email exists!",
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        status: "FAILED",
        message: "Email hasn't been verified yet. Check your inbox",
      });
    }

    // Proceed with email to reset password
    sendResetEmail(user, redirectUrl, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred while processing your request.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  let { userId, resetString, newPassword } = req.body;

  PasswordReset.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // Password reset record exists
        const { expiresAt } = result[0];
        const hashedResetString = result[0].resetString;

        // Check if reset string is expired
        if (expiresAt < Date.now()) {
          PasswordReset.deleteOne({ userId })
            .then(() => {
              // Reset record deleted successfully
              res.json({
                status: "FAILED",
                message: "Password reset link has expired.",
              });
            })
            .catch((error) => {
              // Deletion failed
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Clearing password reset record failed.",
              });
            });
        } else {
          // Valid reset record exists, so validate the reset string
          // First, compare the hashed reset string
          bcrypt
            .compare(resetString, hashedResetString)
            .then((result) => {
              if (result) {
                // Strings matched
                // Hash the new password
                const saltRounds = 10;
                bcrypt
                  .hash(newPassword, saltRounds)
                  .then((hashedNewPassword) => {
                    // Update user password
                    User.updateOne(
                      { _id: userId },
                      { password: hashedNewPassword }
                    )
                      .then(() => {
                        // Update completed, now delete reset record
                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            // Both user record and reset record updated
                            res.json({
                              status: "SUCCESS",
                              message: "Password has been reset successfully.",
                            });
                          })
                          .catch((error) => {
                            console.log(error);
                            res.json({
                              status: "FAILED",
                              message:
                                "An error occurred while finalizing password reset.",
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        res.json({
                          status: "FAILED",
                          message: "Updating user password failed.",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    res.json({
                      status: "FAILED",
                      message: "An error occurred while hashing new password.",
                    });
                  });
              } else {
                // Existing record but incorrect reset string passed
                res.json({
                  status: "FAILED",
                  message: "Invalid password reset details passed.",
                });
              }
            })
            .catch((error) => {
              res.json({
                status: "FAILED",
                message: "Comparing password reset strings failed.",
              });
            });
        }
      } else {
        // Password reset record doesn't exist
        res.json({
          status: "FAILED",
          message: "Password reset request not found.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Checking for existing password reset record failed.",
      });
    });
};
