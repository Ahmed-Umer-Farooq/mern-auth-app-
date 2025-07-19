import React, { useContext } from 'react';
import { assets } from '../assets/assets'
import { AppContext } from '../context/appContext';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className='min-h-screen flex flex-col items-center justify-start pt-32 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6' />
      <h1 className='flex items-center justify-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey there, {userData ? userData.name : 'Developer'}! <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>
      <h2 className='text-3xl sm:text-5xl font-bold mb-4'>
        welcome to our App
      </h2>
      <p className='mb-8 max-w-md mx-auto'>
        This is a simple MERN stack application that demonstrates user authentication and authorization. You can register, login, and reset your password.
      </p>
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
        Get Started
      </button>
    </div>
  )
}

export default Header
