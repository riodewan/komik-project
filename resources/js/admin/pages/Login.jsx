import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import axios from '../../axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    setLoading(true);

    try {
      // 🔐 POST login
      const res = await axios.post('/api/login', { email, password });
      const token = res.data.token;

      localStorage.setItem('token', token);

      // 🧠 Ambil data user
      const userRes = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(userRes.data); // << lihat ini
      const role = (res.data.user?.role || '').toLowerCase();

      localStorage.setItem('role', role);

      setAlert({ type: 'success', message: 'Login berhasil!' });
      
      setTimeout(() => {
        if (['admin', 'editor'].includes(role)) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Email atau password salah'
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0e0e10] via-[#151515] to-[#0e0e10] flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-3xl top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500 rounded-full opacity-20 blur-3xl bottom-[-100px] right-[-100px]" />

      {/* Glass Login Card */}
      <div className={`relative z-10 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-md text-white transition-transform duration-300 ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-400">Shinigami Login</h2>
          <p className="text-gray-400 text-sm mt-1">Masuk ke dunia komik favoritmu</p>
        </div>

        {alert.message && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
            alert.type === 'error'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-green-500/20 text-green-400 border border-green-500/40'
          }`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-[#202024] border border-[#2e2e30] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@shinigami.id"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full px-4 py-3 pr-12 bg-[#202024] border border-[#2e2e30] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3 text-gray-400 hover:text-purple-400 transition"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:to-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Loading..." : <><LogIn size={20} /> Masuk</>}
          </button>
        </form>
        
        <div className="mt-6 text-center">
        <a
          href="http://localhost:8000/api/auth/google/redirect"
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Masuk dengan Google
        </a>
      </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Belum punya akun?{' '}
          <a href="/register" className="text-purple-400 hover:underline">
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
}
