// Import required modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/model.js';
import transporter from '../config/nodemailer.js';

// Register a new user
export const register = async (req, res) => {
  // Log the request body for debugging
  console.log("BODY:", req.body);
  const { name, email: rawEmail, password } = req.body;
  const email = rawEmail.trim().toLowerCase();

  // Check for missing details
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing details' });
  }
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user in the database
    const user = await userModel.create({ name, email, password: hashedPassword });
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Our App!',
      text: `Welcome to our app! We're glad to have you on board EMAIL_ID: ${email}.`
    };
    await transporter.sendMail(mailOptions);
    // Respond with user and token
    return res.json({ success: true, user, token });
  } catch (error) {
    // Handle errors during registration
    return res.json({ success: false, message: 'Error creating user', error: error.message });
  }
};

// Log in an existing user
export const login = async (req, res) => {
  const { email: rawEmail, password } = req.body;
  const email = rawEmail.trim().toLowerCase();
  // Check for missing email or password
  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Respond with user and token
    return res.json({ success: true, user, token });
  } catch (error) {
    // Handle errors during login
    return res.json({ success: false, message: 'Error logging in', error: error.message });
  }
};

// Log out the user by clearing the token cookie
export const logout = async (req, res) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    // Respond with logout success
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    // Handle errors during logout
    return res.json({ success: false, message: 'Error logging out', error: error.message });
  }
};

// Send verification OTP to user's email
export const sendVerifyOtp = async (req, res) => {
  // Use userId from userAuth middleware
  const userId = req.userId;
  if (!userId) {
    return res.json({ success: false, message: 'User id is required or not authorized' });
  }
  try {
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, message: 'Account already verified' });
    }
    // Generate a 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    // Set OTP and expiry (2 hours from now)
    user.verifyotp = otp;
    user.verifyotpExpireAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    await user.save();
    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Verify your email',
      text: `Your verification OTP is ${otp}`
    };
    await transporter.sendMail(mailOptions);
    // Respond with success
    return res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    // Handle errors during OTP sending
    return res.json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

// Verify user's email with OTP
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  // Check for missing details
  if (!userId || !otp) {
    return res.json({ success: false, message: 'Missing details' });
  }
  try {
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    // Check if OTP matches
    if (user.verifyotp !== otp || !user.verifyotp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }
    // Mark account as verified and clear OTP
    user.isAccountVerified = true;
    user.verifyotp = '';
    user.verifyotpExpireAt = 0;
    await user.save();
    // Respond with success
    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    // Handle errors during verification
    return res.json({ success: false, message: 'Error verifying email', error: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = (req, res) => {
  try {
    // If userId is set by userAuth middleware, user is authenticated
    if (req.userId) {
      return res.json({ success: true, message: 'User is authenticated' });
    } else {
      return res.json({ success: false, message: 'User is not authenticated' });
    }
  } catch (error) {
    // Handle errors during authentication check
    return res.json({ success: false, message: 'Error checking authentication', error: error.message });
  }
};

// Send password reset OTP to user's email
export const sendPasswordResetOtp = async (req, res) => {
  console.log("Reset password request body:", req.body); // Debug log
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    // Generate a 6-digit OTP (same logic as sendVerifyOtp)
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    console.log(`Generated OTP for ${email}: ${otp}`); // Debug log
    
    // Set OTP and expiry (15 minutes from now)
    user.resetotp = otp;
    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();
    
    // Send OTP email with better error handling
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">You have requested to reset your password. Please use the following OTP to complete the process:</p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">This OTP will expire in 15 minutes.</p>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't request this password reset, please ignore this email.</p>
          </div>
        </div>
      `,
      text: `Your OTP for resetting your password is ${otp}. This OTP will expire in 15 minutes.`
    };
    
    console.log('Attempting to send email to:', user.email); // Debug log
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      user: process.env.SMTP_USER ? 'Set' : 'Not set',
      pass: process.env.SMTP_PASS ? 'Set' : 'Not set',
      sender: process.env.SENDER_EMAIL ? 'Set' : 'Not set'
    });
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', user.email); // Debug log
    
    return res.json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (error) {
    console.error('Error in sendPasswordResetOtp:', error); // Debug log
    return res.json({ success: false, message: 'Error generating password reset OTP', error: error.message });
  }
};

// Reset user password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // Check for missing details
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP, and new password are required' });
  }
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    // Check if OTP matches and is not expired
    if (user.resetotp === "" || user.resetotp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }
    if (Date.now() > user.resetOtpExpiredAt) {
      return res.json({ success: false, message: 'OTP has expired' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    // Clear OTP fields
    user.resetotp = '';
    user.resetOtpExpiredAt = 0;
    await user.save();
    // Respond with success
    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    // Handle errors during password reset
    return res.json({ success: false, message: 'Error resetting password', error: error.message });
  }
};

// Verify password reset OTP
export const verifyPasswordResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: 'Email and OTP are required' });
  }
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    // Check if OTP matches and is not expired
    if (user.resetotp === "" || user.resetotp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }
    if (Date.now() > user.resetOtpExpiredAt) {
      return res.json({ success: false, message: 'OTP has expired' });
    }
    // OTP is valid
    return res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    return res.json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
}; 