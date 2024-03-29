import { useRouter } from 'next/router';
import { useEffect } from 'react';


const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!token) {
        router.push('/login');
        return;
      }

      if (router.pathname === '/dashboard' && !userData.isAdmin) {
        router.push('/homePage');
      }
    }, []);

    return <Component {...props} />;
  };

  return Auth;
};

export default withAuth;
