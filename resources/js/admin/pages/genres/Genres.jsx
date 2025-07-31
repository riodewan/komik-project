import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { motion } from "framer-motion";
import { showSuccess, showError } from "../../../src/utils/toast";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGenres = () => {
    axios.get("/api/admin/genres", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setGenres(res.data))
    .catch(err => showError("Gagal memuat genre"))
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!confirm("Yakin ingin menghapus genre ini?")) return;
    axios.delete(`/api/admin/genres/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => {
      setGenres(prev => prev.filter(g => g.id !== id));
      showSuccess("Genre berhasil dihapus");
    })
    .catch(() => showError("Gagal hapus genre"));
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
        <p className="text-gray-400 text-center">Memuat data...</p>
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
            {genres.map((g, index) => (
              <motion.tr
                key={g.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
          </tbody>
        </motion.table>
      )}
    </div>
  );
}
