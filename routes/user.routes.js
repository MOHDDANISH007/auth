import express from "express";
import jwt from 'jsonwebtoken';
import { login, logout, profile, register } from "../controller/user.controller.js";

const router = express.Router();

// Middleware to protect routes
export const protectMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    console.log('Token from cookies:', token); // Log the token for debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request object
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", protectMiddleware, profile);

export default router;