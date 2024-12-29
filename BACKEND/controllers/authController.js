//./controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/authMiddleware");
const {
  sendOTPVerificationEmail,
  sendVerificationEmail,
} = require("../utils/emailUtils");

exports.signup = async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    password,
    address,
    phoneNumber,
    role = "customer",
  } = req.body;
  firstName = firstName?.trim();
  lastName = lastName?.trim();
  email = email?.trim();
  password = password?.trim();
  address = address?.trim();
  phoneNumber = phoneNumber?.trim();
  role = role?.trim();

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !address ||
    !phoneNumber
  ) {
    res.json({
      status: "FAILED",
      message: "All fields are required!",
    });
  } else if (!/^[a-zA-Z]*$/.test(firstName) || !/^[a-zA-Z]*$/.test(lastName)) {
    res.json({
      status: "FAILED",
      message: "Invalid name format",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email format",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password is too short!",
    });
  } else {
    // Check if user already exists
    User.findOne({ email })
      .then((result) => {
        if (result) {
          // A user already exists
          res.json({
            status: "FAILED",
            message: "User with the provided email already exists",
          });
        } else {
          // Hash the password
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                address,
                phoneNumber,
                role,
                verified: false,
              });

              newUser
                .save()
                .then((result) => {
                  // Send OTP verification email
                  sendOTPVerificationEmail(result, res);
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    status: "FAILED",
                    message: "An error occurred while saving user account!",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing password!",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user!",
        });
      });
  }
};

/* exports.signin = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Email and password are required",
    });
  } else {
    // Check if user exists
    User.find({ email })
      .then((data) => {
        if (data.length) {
          // User exists
          // Check if user is verified
          if (!data[0].verified) {
            res.json({
              status: "FAILED",
              message: "Email hasn't been verified yet. Check your inbox.",
            });
          } else {
            const hashedPassword = data[0].password;
            // Compare the password with the hashed password
            bcrypt
              .compare(password, hashedPassword)
              .then((result) => {
                if (result) {
                  // Passwords match
                  const token = jwt.sign(
                    { id: data[0]._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                  );
                  res.json({
                    status: "SUCCESS",
                    message: "Signin successful",
                    data: data[0],
                    token: token,
                  });
                } else {
                  res.json({
                    status: "FAILED",
                    message: "Invalid password entered!",
                  });
                }
              })
              .catch((err) => {
                res.json({
                  status: "FAILED",
                  message: "An error occurred while comparing passwords",
                });
              });
          }
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user",
        });
      });
  }
};
 */

exports.signin = async (req, res) => {
  try {
    let { email, username, password } = req.body;

    // Check if either email or username is provided
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // If email is provided, use it as the username
    username = email || username;

    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials entered!",
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        message: "Email hasn't been verified yet. Check your inbox.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password entered!",
      });
    }

    // Generate token using the function from authMiddleware
    const token = generateToken({ id: user._id, role: user.role });

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Signin error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "An error occurred during signin",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
