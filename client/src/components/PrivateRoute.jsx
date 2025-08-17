import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/simpleAppContext';

const PrivateRoute = () => {
  const { isLoggedIn } = useContext(AppContext);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 