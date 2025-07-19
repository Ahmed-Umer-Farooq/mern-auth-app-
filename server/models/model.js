// Import mongoose for MongoDB object modeling
import mongoose from "mongoose";

// Define the user schema with all required fields
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true, unique: true }, // User's email (must be unique)
  password: { type: String, required: true }, // Hashed password
  verifyotp: { type: String, default: '' }, // OTP for email verification
  verifyotpExpireAt: { type: Number, default: 0 }, // OTP expiry timestamp for verification
  isAccountVerified: { type: Boolean, default: false }, // Email/account verification status
  resetotp: { type: String, default: '' }, // OTP for password reset
  resetOtpExpiredAt: { type: Number, default: 0 } // OTP expiry timestamp for password reset
});

// Create the user model, or use existing if already defined (for hot-reloading)
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

// Export the user model for use in controllers and routes
export default userModel; 