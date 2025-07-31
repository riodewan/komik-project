import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../axios';

export default function ProtectedLayout({ roles = [] }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);

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
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data);
        setAuth(true);
      } catch (err) {
        setAuth(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-600">🔒 Memeriksa akses...</div>;

  if (!auth) return <Navigate to="/admin" replace />;

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
