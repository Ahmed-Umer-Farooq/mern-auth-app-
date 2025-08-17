import React, { useContext } from 'react';
import { AppContext } from '../context/simpleAppContext';

function HomeTest() {
  console.log('HomeTest component rendering...');
  
  try {
    const contextData = useContext(AppContext);
    console.log('Full context data:', contextData);
    
    if (!contextData) {
      return (
        <div style={{ padding: '20px', background: 'orange', minHeight: '100vh' }}>
          <h1>Context is undefined!</h1>
          <p>AppContext is not being provided properly</p>
        </div>
      );
    }
    
    const { backendUrl, isLoggedIn, userData, loading } = contextData;
    
    return (
      <div style={{ padding: '20px', background: 'lightblue', minHeight: '100vh' }}>
        <h1>APP CONTEXT WORKING! 🎉</h1>
        <p><strong>Backend URL:</strong> {backendUrl}</p>
        <p><strong>Is Logged In:</strong> {isLoggedIn ? 'Yes' : 'No'}</p>
        <p><strong>User Data:</strong> {userData ? JSON.stringify(userData) : 'None'}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <button 
          onClick={() => contextData.getUserData()}
          style={{ padding: '10px 20px', marginTop: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Test API Call
        </button>
      </div>
    );
  } catch (error) {
    console.error('Error in HomeTest:', error);
    return (
      <div style={{ padding: '20px', background: 'lightcoral', minHeight: '100vh' }}>
        <h1>Error in Home Component!</h1>
        <p><strong>Error:</strong> {error.message}</p>
        <p><strong>Stack:</strong> {error.stack}</p>
      </div>
    );
  }
}

export default HomeTest;
