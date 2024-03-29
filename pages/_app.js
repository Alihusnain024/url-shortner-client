import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from '../utils/userContext';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
