import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGenres = () => {
    axios.get("/api/admin/genres", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setGenres(res.data))
    .catch(() => {
      MySwal.fire({
        icon: "error",
        title: "Gagal Memuat",
        text: "Tidak dapat mengambil data genre.",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#ef4444"
      });
    })
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Yakin hapus genre ini?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: "#1f2937",
      color: "#fff"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/admin/genres/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
          setGenres(prev => prev.filter(g => g.id !== id));
          MySwal.fire({
            icon: "success",
            title: "Dihapus!",
            text: "Genre berhasil dihapus.",
            background: "#1f2937",
            color: "#fff",
            confirmButtonColor: "#3b82f6"
          });
        })
        .catch(() => {
          MySwal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menghapus genre.",
            background: "#1f2937",
            color: "#fff",
            confirmButtonColor: "#ef4444"
          });
        });
      }
    });
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎵 Manajemen Genre</h1>
        <Link
          to="/admin/genres/create"
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
        >
          + Tambah Genre
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : genres.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-gray-400 bg-gray-800 rounded-lg"
        >
          Belum ada genre. Klik <span className="text-blue-400">+ Tambah Genre</span> untuk menambahkan.
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
              <th className="p-3 border-b border-gray-600">Nama Genre</th>
              <th className="p-3 border-b border-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {genres.map((g, index) => (
                <motion.tr
                  key={g.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="hover:bg-gray-700 transition"
                >
                  <td className="p-3 border-b border-gray-700">{index + 1}</td>
                  <td className="p-3 border-b border-gray-700 font-medium">{g.name}</td>
                  <td className="p-3 border-b border-gray-700 space-x-3">
                    <Link
                      to={`/admin/genres/edit/${g.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(g.id)}
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
