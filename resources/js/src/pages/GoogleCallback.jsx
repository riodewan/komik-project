import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('token', token);

      axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        const role = (res.data.user?.role || '').toLowerCase();
        localStorage.setItem('role', role);

        if (['admin', 'editor'].includes(role)) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div className="text-white text-center mt-20">Sedang memproses login Google...</div>;
}
