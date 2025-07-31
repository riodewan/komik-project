import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import Error403 from '../../src/pages/Error403';

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuth(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('User Data:', res.data); // ✅ Debug
        const userRole = (res.data.role || res.data.data?.role || '').toLowerCase();
        console.log('Detected Role:', userRole);

        setRole(userRole);
        setAuth(true);
      } catch (err) {
        console.error('Auth Error:', err.response?.data || err.message);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!auth) return <Navigate to="/login" replace />;

  if (role && role !== 'admin') {
    return <Error403 />;
  }

  return children;
}
