import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { motion, AnimatePresence } from "framer-motion";

const MySwal = withReactContent(Swal);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    axios
      .get("/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUsers(res.data.data))
      .catch(() =>
        MySwal.fire({
          icon: "error",
          title: "Gagal Memuat",
          text: "Tidak dapat mengambil data pengguna.",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        })
      )
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Hapus User?",
      text: "Data user akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#1f2937",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          .then(() => {
            setUsers((prev) => prev.filter((user) => user.id !== id));
            MySwal.fire({
              icon: "success",
              title: "Terhapus!",
              text: "User berhasil dihapus.",
              background: "#1f2937",
              color: "#fff",
              confirmButtonColor: "#3b82f6",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            MySwal.fire({
              icon: "error",
              title: "Gagal",
              text: "Terjadi kesalahan saat menghapus user.",
              background: "#1f2937",
              color: "#fff",
              confirmButtonColor: "#ef4444",
            });
          });
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👥 Manajemen Pengguna</h1>
        <Link
          to="/admin/users/create"
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          + Tambah Pengguna
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-gray-400 bg-gray-800 rounded-lg"
        >
          Belum ada pengguna. Klik <span className="text-blue-400">+ Tambah Pengguna</span> untuk menambahkan.
        </motion.div>
      ) : (
        <motion.table
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-left border-collapse bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 border-b border-gray-600">#</th>
              <th className="p-3 border-b border-gray-600">Avatar</th>
              <th className="p-3 border-b border-gray-600">Nama</th>
              <th className="p-3 border-b border-gray-600">Username</th>
              <th className="p-3 border-b border-gray-600">Email</th>
              <th className="p-3 border-b border-gray-600">Role</th>
              <th className="p-3 border-b border-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="hover:bg-gray-700 transition"
                >
                  <td className="p-3 border-b border-gray-700">{index + 1}</td>
                  <td className="p-3 border-b border-gray-700">
                    <img
                      src={user.avatar ? `/storage/${user.avatar}` : "/default-avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3 border-b border-gray-700">{user.name}</td>
                  <td className="p-3 border-b border-gray-700 text-gray-400">{user.username || "-"}</td>
                  <td className="p-3 border-b border-gray-700">{user.email}</td>
                  <td className="p-3 border-b border-gray-700">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 border-b border-gray-700 space-x-3">
                    <Link
                      to={`/admin/users/edit/${user.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      )}
    </div>
  );
}
