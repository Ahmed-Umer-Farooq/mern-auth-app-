import React, { useRef, useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/simpleAppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const EmailVerify = () => {
  const inputRefs = useRef([]);
  const { backendUrl, getUserData, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user data to check if user is logged in
        await getUserData();
        setChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setChecking(false);
      }
    };

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setChecking(false);
    }, 3000);

    checkAuth();

    return () => clearTimeout(timeout);
  }, [getUserData]);

  // If still checking, show loading
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0c3fc] to-[#8ec5fc]">
        <div className="bg-[#232846] rounded-2xl p-8 shadow-lg flex flex-col items-center w-full max-w-md">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is already verified, redirect to home
  if (userData && userData.isAccountVerified) {
    navigate('/');
    return null;
  }

  const handleSendOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        toast.success('Verification email sent!');
        setIsOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
      console.error('Send OTP error:', error.response || error);
    }
  };

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the 6-digit OTP.');
      return;
    }
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp: otpString }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed!');
      console.error('OTP verification error:', error.response || error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0c3fc] to-[#8ec5fc]">
      <div className="bg-[#232846] rounded-2xl p-8 shadow-lg flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2">Email Verification</h2>
        
        {!isOtpSent ? (
          // Step 1: Send OTP
          <div className="w-full">
            <p className="text-white opacity-80 mb-6 text-center">
              Click the button below to send a verification OTP to your email.
            </p>
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#7B7BFF] to-[#5B5BFF] text-white font-semibold text-lg transition-all hover:opacity-90"
            >
              Send Verification OTP
            </button>
            <button
              type="button"
              className="w-full mt-4 py-2.5 rounded-full border border-gray-400 text-white font-semibold text-lg transition-all hover:bg-gray-700"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        ) : (
          // Step 2: Enter OTP
          <form onSubmit={onSubmitHandler} className="w-full">
            <p className="text-white opacity-80 mb-6 text-center">
              Enter the 6-digit code sent to your email.
            </p>
            <div className="flex gap-3 mb-6 justify-center">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-bold bg-[#333A5C] text-white rounded-lg border-2 border-[#7B7BFF] focus:border-white outline-none"
                  value={otp[index]}
                  onChange={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#7B7BFF] to-[#5B5BFF] text-white font-semibold text-lg transition-all hover:opacity-90"
            >
              Verify Email
            </button>
            <button
              type="button"
              className="w-full mt-4 py-2.5 rounded-full border border-gray-400 text-white font-semibold text-lg transition-all hover:bg-gray-700"
              onClick={() => setIsOtpSent(false)}
            >
              Send OTP Again
            </button>
            <button
              type="button"
              className="w-full mt-2 py-2.5 rounded-full border border-gray-400 text-white font-semibold text-lg transition-all hover:bg-gray-700"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
