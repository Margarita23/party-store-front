import React, {useState, useEffect} from 'react'
import HeaderMenu from './HeaderMenu.tsx';
import { Outlet, Navigate } from 'react-router-dom';
import axiosInstance from '../api/axios.ts';

function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

	useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/current_user');
        if (response.status === 200 && response.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
					setIsAuthenticated(false);
					console.log('++')
				} else {
					console.error('Error checking authentication:', error);
				}
      } finally {
				setLoading(false);
			}
    };

    checkAuth();
  }, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
		<HeaderMenu />
			<main style={{ marginTop: '64px' }}>
				<Outlet />
      </main>
    </>
  )
}

export default Layout
