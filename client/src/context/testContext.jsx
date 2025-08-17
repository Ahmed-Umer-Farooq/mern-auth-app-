import React, { createContext } from 'react';

// Create a simple test context
export const TestContext = createContext();

export const TestContextProvider = ({ children }) => {
  console.log('TestContextProvider is rendering...');
  
  const testValue = {
    message: 'Test context is working!',
    backendUrl: 'http://localhost:5000'
  };
  
  console.log('TestContext value:', testValue);
  
  return (
    <TestContext.Provider value={testValue}>
      {children}
    </TestContext.Provider>
  );
};
