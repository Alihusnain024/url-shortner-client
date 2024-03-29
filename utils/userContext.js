import React, { createContext, useState,useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered,setIsRegistered]=useState(false);
  const [userData, setUserData] = useState({ username: '', isAdmin: false, id: '' });
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);


  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData, isRegistered,setIsRegistered }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
