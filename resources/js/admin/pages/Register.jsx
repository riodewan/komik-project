import { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    // ✅ Validasi manual
    if (form.password.length < 6) {
      setAlert({ type: 'error', message: 'Password minimal 6 karakter' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setAlert({ type: 'error', message: 'Konfirmasi password tidak cocok' });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      const token = res.data.token;
      localStorage.setItem('token', token);

      setAlert({ type: 'success', message: 'Pendaftaran berhasil! Mengarahkan...' });

      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Gagal mendaftar'
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0e0e10] via-[#151515] to-[#0e0e10] flex items-center justify-center relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full opacity-20 blur-3xl top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-pink-500 rounded-full opacity-20 blur-3xl bottom-[-100px] right-[-100px]" />

      <div className={`relative z-10 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-md text-white transition-transform duration-300 ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-400">Daftar Akun</h2>
          <p className="text-gray-400 text-sm mt-1">Gabung bersama Shinigami</p>
        </div>

        {alert.message && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
            alert.type === 'error'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-green-500/20 text-green-400 border border-green-500/40'
          }`}>{alert.message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Nama</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 bg-[#202024] border border-[#2e2e30] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 bg-[#202024] border border-[#2e2e30] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                className="w-full px-4 py-3 pr-12 bg-[#202024] border border-[#2e2e30] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                value={form.password}
                onChange={handleChange}
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

          <div>
            <label className="block mb-1 text-sm text-gray-300">Konfirmasi Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              name="confirmPassword"
              className="w-full px-4 py-3 bg-[#202024] border border-[#2e2e30] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:to-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Loading..." : <><UserPlus size={20} /> Daftar</>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Sudah punya akun?{' '}
          <a href="/login" className="text-purple-400 hover:underline">
            Masuk
          </a>
        </div>
      </div>
    </div>
  );
}
