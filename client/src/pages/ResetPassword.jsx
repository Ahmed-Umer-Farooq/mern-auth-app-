import React, { useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Set axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-password-reset-otp', {
        email: email
      });
      
      if (response.data.success) {
        toast.success('OTP sent to your email!');
        setIsEmailSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-password-reset-otp', {
        email: email,
        otp: otpString
      });

      if (response.data.success) {
        toast.success('OTP verified successfully!');
        setIsOtpSubmitted(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying OTP');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: email,
        otp: otp.join(''),
        newPassword: newPassword
      });

      if (response.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#e0c3fc] to-[#8ec5fc] relative">
      {/* Logo in top left */}
      <img
        src={assets.logo}
        alt="logo"
        className="fixed top-6 left-8 w-24 sm:w-28 cursor-pointer z-10"
        onClick={() => navigate('/')}
      />
      
      <div className='w-full max-w-sm flex flex-col items-center bg-[#232846] rounded-2xl p-8 shadow-lg'>
        <h2 className='text-2xl font-bold text-white text-center mb-1'>Reset Password</h2>
        
        {!isEmailSent ? (
          // Step 1: Email Input
          <div className='w-full flex flex-col gap-4'>
            <p className='text-white text-center mb-6 opacity-80'>Enter your email to reset password</p>
            <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} alt="" />
              <input
                type="email"
                placeholder="Enter your email"
                required
                className='bg-transparent outline-none text-white w-full'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSendOtp}
              className='w-full py-2.5 rounded-full bg-gradient-to-r from-[#7B7BFF] to-[#5B5BFF] text-white font-semibold text-lg transition-all hover:opacity-90'
            >
              Send OTP
            </button>
          </div>
        ) : !isOtpSubmitted ? (
          // Step 2: OTP Input
          <div className='w-full flex flex-col gap-4'>
            <p className='text-white text-center mb-4'>Enter the 6-digit OTP sent to your email</p>
            <div className='flex gap-2 justify-center mb-4'>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className='w-12 h-12 text-center text-lg font-bold bg-[#333A5C] text-white rounded-lg border-2 border-[#7B7BFF] focus:border-white outline-none'
                  value={otp[index]}
                  onChange={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <button 
              onClick={handleVerifyOtp}
              className='w-full py-2.5 rounded-full bg-gradient-to-r from-[#7B7BFF] to-[#5B5BFF] text-white font-semibold text-lg transition-all hover:opacity-90'
            >
              Verify OTP
            </button>
            <button 
              onClick={() => setIsEmailSent(false)}
              className='text-[#7B7BFF] hover:underline text-sm'
            >
              Back to email
            </button>
          </div>
        ) : (
          // Step 3: New Password Input
          <div className='w-full flex flex-col gap-4'>
            <p className='text-white text-center mb-6 opacity-80'>Enter your new password</p>
            <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.lock_icon} alt="" />
              <input
                type="password"
                placeholder="Enter new password"
                required
                className='bg-transparent outline-none text-white w-full'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <button 
              onClick={handleResetPassword}
              className='w-full py-2.5 rounded-full bg-gradient-to-r from-[#7B7BFF] to-[#5B5BFF] text-white font-semibold text-lg transition-all hover:opacity-90'
            >
              Reset Password
            </button>
          </div>
        )}
        
        <div className='mt-6 text-center'>
          <span 
            className='text-[#7B7BFF] hover:underline cursor-pointer text-sm'
            onClick={() => navigate('/login')}
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
