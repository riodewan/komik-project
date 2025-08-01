import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../../axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'User',
    username: '',
    bio: '',
    avatar: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        const data = res.data.data;
        setForm({
          name: data.name,
          email: data.email,
          role: data.role,
          username: data.username || '',
          bio: data.bio || '',
          avatar: null,
        });
      })
      .catch(() => {
        MySwal.fire({
          icon: 'error',
          title: 'Gagal Mengambil Data',
          text: 'Tidak dapat mengambil data user.',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#ef4444',
          backdrop: 'rgba(0,0,0,0.4) blur(5px)',
        }).then(() => navigate('/admin/users'));
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      await axios.post(`/api/admin/users/${id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'User berhasil diupdate.',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        backdrop: 'rgba(0,0,0,0.4) blur(5px)',
        showClass: { popup: 'animate__animated animate__zoomIn' },
        hideClass: { popup: 'animate__animated animate__zoomOut' },
      }).then(() => navigate('/admin/users'));

    } catch (err) {
      const errors = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join("\n")
        : 'Terjadi kesalahan saat update user.';

      MySwal.fire({
        icon: 'error',
        title: 'Gagal Update User',
        html: `<pre style="text-align:left">${errors}</pre>`,
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        backdrop: 'rgba(0,0,0,0.4) blur(5px)',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-dashboard-enter">
      <div className="bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6 md:p-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Edit Pengguna
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
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Editor">Editor</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium shadow disabled:opacity-50 flex items-center gap-2 transition"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                </svg>
              )}
              {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
