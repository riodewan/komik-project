import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../../axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { showSuccess, showError } from '../../../src/utils/toast';

const MySwal = withReactContent(Swal);

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => setUsers(res.data.data))
    .catch((err) => console.error("Gagal mengambil data user:", err));
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Hapus User?',
      text: 'Data user akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      background: '#1f2937',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      backdrop: 'rgba(0,0,0,0.4) blur(5px)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setUsers(prev => prev.filter(user => user.id !== id));

          MySwal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'User berhasil dihapus.',
            background: '#1f2937',
            color: '#fff',
            confirmButtonColor: '#3b82f6',
            backdrop: 'rgba(0,0,0,0.4) blur(5px)',
            timer: 1500,
            showConfirmButton: false,
          });

        } catch (err) {
          showError('❌ Terjadi kesalahan saat menghapus user');
        }
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 md:p-8 animate-dashboard-enter">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Manajemen Pengguna
        </h1>
        <Link
          to="/admin/users/create"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition shadow"
        >
          + Tambah Pengguna
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">#</th>
              <th className="p-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">Nama</th>
              <th className="p-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">Email</th>
              <th className="p-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">Role</th>
              <th className="p-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <td className="p-3 border-b dark:border-gray-800 text-gray-800 dark:text-gray-200">{index + 1}</td>
                <td className="p-3 border-b dark:border-gray-800 text-gray-800 dark:text-gray-200">{user.name}</td>
                <td className="p-3 border-b dark:border-gray-800 text-gray-800 dark:text-gray-200">{user.email}</td>
                <td className="p-3 border-b dark:border-gray-800">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full 
                    ${user.role === 'admin'
                      ? 'bg-purple-200 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300'
                      : 'bg-blue-200 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 border-b dark:border-gray-800">
                  <Link
                    to={`/admin/users/edit/${user.id}`}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500 dark:text-gray-400">
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
