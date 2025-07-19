// Import required modules and controllers
import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendPasswordResetOtp, resetPassword, verifyPasswordResetOtp } from '../controllers/authcontroller.js';
import userAuth from '../middleware/userAuth.js';

// Create a new Express router for authentication
const authrouter = express.Router();

// Route to register a new user
authrouter.post('/register', register);
// Route to log in a user
authrouter.post('/login', login);
// Route to log out a user
authrouter.post('/logout', logout);
// Route to send verification OTP (requires authentication)
authrouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
// Route to verify user's email (requires authentication)
authrouter.post('/verify-account', userAuth, verifyEmail);
// Route to check if user is authenticated (requires authentication)
authrouter.post('/is-authenticated', userAuth, isAuthenticated);
// Route to send password reset OTP
authrouter.post('/send-password-reset-otp', sendPasswordResetOtp);
// Route to verify password reset OTP
authrouter.post('/verify-password-reset-otp', verifyPasswordResetOtp);
// Route to reset password using OTP
authrouter.post('/reset-password', resetPassword);

// Export the authentication router for use in server.js
export default authrouter; 