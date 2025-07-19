import React, { useContext, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { AppContext } from '../context/appContext';

function Home() {
  const { userData, getUserData } = useContext(AppContext);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className='relative min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavBar />
      <Header />
      {userData && (
        <h2 className="text-center text-2xl font-bold mt-4">
          Hi {userData.name} 👋
        </h2>
      )}
      <h1>Hey {userData ? userData.name : "developer"}</h1>
    </div>
  );
}

export default Home;
