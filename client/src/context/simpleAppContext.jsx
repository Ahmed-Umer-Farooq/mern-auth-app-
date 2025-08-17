import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  console.log('Enhanced AppContextProvider is rendering...');
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to get user data from backend
  const getUserData = async () => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    try {
      setLoading(true);
      console.log('Fetching user data from:', backendUrl + '/api/user/data');
      
      const { data } = await axios.get(backendUrl + '/api/user/data', { 
        withCredentials: true,
        timeout: 8000 // 8 second timeout
      });
      
      if (data && data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true);
        console.log('User data loaded:', data.userData);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
        console.log('No user data - not logged in');
      }
    } catch (error) {
      console.log('Error fetching user data:', error.message);
      setUserData(null);
      setIsLoggedIn(false);
      
      // Only log actual errors, not just "user not logged in"
      if (error.response?.status !== 401 && error.code !== 'ECONNREFUSED') {
        console.error('API Error:', error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      // Only check if we don't already have user data
      if (!userData && !isLoggedIn) {
        await getUserData();
      }
    };
    
    checkSession();
  }, []); // Run once on mount

  const contextValue = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loading
  };

  console.log('Enhanced AppContext value:', contextValue);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
