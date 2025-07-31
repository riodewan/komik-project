import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../../axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function EditGenre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/admin/genres/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => setName(res.data.name))
      .catch(() => {
        MySwal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengambil data genre.",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
        navigate("/admin/genres");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      MySwal.fire({
        icon: "warning",
        title: "Nama Genre Terlalu Pendek",
        text: "Minimal 2 karakter.",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setSaving(true);
    try {
      await axios.put(
        `/api/admin/genres/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      MySwal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Genre berhasil diupdate!",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      }).then(() => navigate("/admin/genres"));

    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat update genre.",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Edit Genre</h1>
          <Link
            to="/admin/genres"
            className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
          >
            ⬅ Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-2">Nama Genre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama genre"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition text-white px-4 py-3 rounded-lg font-semibold shadow-lg disabled:opacity-50"
          >
            {saving && (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
              </svg>
            )}
            {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
