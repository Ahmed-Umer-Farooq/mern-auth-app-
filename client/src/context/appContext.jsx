// appContext.js
import React, { useState } from 'react';
import { AppContext } from './appContext.js';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  // Function to get user data from backend
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data', { withCredentials: true });
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AppContext.Provider value={{ backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData, getUserData }}>
      {children}
    </AppContext.Provider>
  );
}; 