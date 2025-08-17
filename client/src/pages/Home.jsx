import React, { useContext, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { AppContext } from '../context/simpleAppContext';

function Home() {
  const { userData, getUserData, isLoggedIn } = useContext(AppContext);

  useEffect(() => {
    // Only call getUserData if we might be logged in
    if (!userData && !isLoggedIn) {
      getUserData();
    }
  }, [getUserData, userData, isLoggedIn]);

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <NavBar />
      <Header />
      {userData && (
        <h2 className="text-center text-2xl font-bold mt-4 text-gray-800">
          Hi {userData.name} 👋
        </h2>
      )}
    </div>
  );
}

export default Home;
