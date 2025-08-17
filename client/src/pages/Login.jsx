import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Set axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('Backend URL:', backendUrl);
    setIsLoggedIn(false);
  }, [backendUrl, setIsLoggedIn]);

  // Form submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === 'Sign Up') {
        // Registration API call
        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          { name, email, password }
        );
        if (data.success) {
          toast.success('Registration successful! Please log in.');
          setState('Login'); // Switch to login form
          setName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(data.message);
        }
      } else {
        // Login API call
        const res = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        const { data } = res;
        if (data.success) {
          toast.success('Successfully logged in!');
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
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
        <h2 className='text-2xl font-bold text-white text-center mb-1'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        {state === 'Sign Up' ? (
          <p className='text-white text-center mb-6 opacity-80'>Create your account</p>
        ) : (
          <p className='text-white text-center mb-6 opacity-80'>Login to your account!</p>
        )}
        <form className='w-full flex flex-col gap-4' onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className='bg-transparent outline-none text-white w-full'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email id"
              required
              className='bg-transparent outline-none text-white w-full'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className='bg-transparent outline-none text-white w-full'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className='flex justify-end'>
            <span
              className='text-xs text-[#7B7BFF] hover:underline cursor-pointer'
              onClick={() => navigate('/reset-password')}
            >
              Forgot password?
            </span>
          </div>
          <button type="submit" className='w-full py-2.5 rounded-full bg-gradient-to-r from-[#7B7BFF] to-[#5B5BFF] text-white font-semibold text-lg mt-2 transition-all hover:opacity-90'>
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <div className='mt-3 text-sm text-center'>
          {state === 'Sign Up' ? (
            <>
              <span className='text-white opacity-80'>Already have an account? </span>
              <span className='text-[#7B7BFF] hover:underline cursor-pointer' onClick={() => setState('Login')}>Login here</span>
            </>
          ) : (
            <>
              <span className='text-white opacity-80'>Don't have an account? </span>
              <span className='text-[#7B7BFF] hover:underline cursor-pointer' onClick={() => setState('Sign Up')}>Sign up</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
