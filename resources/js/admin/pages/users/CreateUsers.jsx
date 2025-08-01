import { useState } from 'react';
import axios from '../../../axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    password: '',
    role: 'User',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password.length < 6) {
      MySwal.fire({
        icon: 'error',
        title: 'Password Terlalu Pendek',
        text: 'Password minimal 6 karakter.',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('email', form.email);
      data.append('username', form.username);
      data.append('bio', form.bio);
      data.append('password', form.password);
      data.append('role', form.role);
      if (form.avatar) data.append('avatar', form.avatar);

      await axios.post('/api/admin/users', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'User berhasil ditambahkan.',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        navigate('/admin/users');
      });

    } catch (err) {
      const errors = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join("\n")
        : 'Terjadi kesalahan saat menambahkan user.';

      MySwal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan User',
        html: `<pre style="text-align:left">${errors}</pre>`,
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-dashboard-enter">
      <div className="bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6 md:p-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tambah Pengguna
          </h1>
          <Link
            to="/admin/users"
            className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
          >
            ⬅ Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Nama</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows="3"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
              placeholder="Minimal 6 karakter" />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white">
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Editor">Editor</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange}
              className="text-sm text-white" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white shadow disabled:opacity-50 flex items-center gap-2 transition">
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                </svg>
              )}
              {loading ? 'Menyimpan...' : '💾 Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
