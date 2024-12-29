// /middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

//Rate Limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Token generation and verification
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      /* if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res.status(401).json({ message: "Authentication required" });
      } else {
        return res.redirect("/login");
      } */
      req.isAuthenticated = false;
      return next();
    }

    const decoded = await exports.verifyToken(token);
    req.user = decoded;
    req.isAuthenticated = true;
    next();
  } catch (err) {
    req.isAuthenticated = false;
    next();
    // return res.status(403).json({ error: "Invalid token" });
  }
};

// Role-based access control middleware
const rbacMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};

// Apply authentication to all routes except public ones
const applyAuthMiddleware = (app) => {
  app.use((req, res, next) => {
    const publicRoutes = [
      "/user/login",
      "/user/logout",
      "/user/signup",
      "/login",
      "/signup",
    ];
    if (publicRoutes.includes(req.path) || req.method === "OPTIONS") {
      return next();
    }
    authMiddleware(req, res, next);
  });
};

// Global error handler
const errorHandler = (app) => {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });
};

// Login route handler
const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.json({ message: "Logged in successfully" });
};

const protectedRouteHandler = (req, res, next) => {
  if (!req.isAuthenticated && !req.path.startsWith("/user/")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Logout route handler
const logoutHandler = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  authMiddleware,
  rbacMiddleware,
  applyAuthMiddleware,
  errorHandler,
  loginHandler,
  logoutHandler,
  rateLimiter,
  protectedRouteHandler,
  generateToken: exports.generateToken, // Add this line
  verifyToken: exports.verifyToken,
};
