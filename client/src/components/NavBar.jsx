
import React, { useContext, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/simpleAppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, setIsLoggedIn, setUserData, backendUrl } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const hideTimeout = useRef(null);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/logout', {}, { withCredentials: true });
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        toast.success('Logged out successfully!');
        window.location.href = '/login';
      } else {
        toast.error(data.message || 'Logout failed!');
      }
    } catch (error) {
      toast.error('Logout failed!');
      console.error('Logout error:', error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', {}, { withCredentials: true });
      if (data.success) {
        toast.success('Verification email sent!');
        navigate('/email-verify');
      } else {
        toast.error(data.message || 'Verification failed!');
      }
    } catch (error) {
      toast.error('Verification failed!');
      console.error('Verify email error:', error);
    }
  };

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setShowMenu(false), 200);
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 '>
      <img src={assets.logo} alt="" className='w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44 h-auto' />
      {userData ? (
        <div
          className='relative'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white font-bold text-lg cursor-pointer'
          >
            {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
          </div>
          {showMenu && (
            <div className='absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50'>
              {!userData.isAccountVerified && (
                <button
                  className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                  onClick={handleVerifyEmail}
                >
                  Verify email
                </button>
              )}
              <button
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default NavBar;
