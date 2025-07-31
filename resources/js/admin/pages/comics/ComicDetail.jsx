import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { showError, showSuccess } from '../../../src/utils/toast';
import { motion } from 'framer-motion';

export default function ComicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);

  const fetchComic = () => {
    axios.get(`/api/admin/comics/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      const data = res.data.data || res.data;
      setComic(data);
      setChapters(data.chapters || []);
    })
    .catch(() => showError('Gagal mengambil data komik'));
  };

  const handleDeleteChapter = (chapterId) => {
    if (!confirm('Yakin ingin menghapus chapter ini?')) return;

    axios.delete(`/api/admin/chapters/${chapterId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setChapters(prev => prev.filter(ch => ch.id !== chapterId));
      showSuccess('Chapter berhasil dihapus');
    })
    .catch(() => showError('Gagal menghapus chapter'));
  };

  useEffect(() => {
    fetchComic();
  }, [id]);

  if (!comic) return <div className="text-center p-10">Memuat komik...</div>;

  return (
    <motion.div
      className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🔙 Tombol Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        ⬅️ Kembali
      </button>

      {/* Info Komik */}
      <motion.div
        className="flex flex-col md:flex-row gap-6 mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {comic.cover_image && (
          <motion.img
            src={`/storage/${comic.cover_image}`}
            alt={comic.title}
            className="w-60 h-80 object-cover rounded-xl shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{comic.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Penulis:</strong> {comic.author || '-'}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Artist:</strong> {comic.artist || '-'}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-3"><strong>Status:</strong> {comic.status}</p>
          
          {/* Genre Badge */}
          {comic.genres && comic.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {comic.genres.map((g, i) => (
                <motion.span
                  key={g.id}
                  className="px-3 py-1 text-xs bg-purple-600/20 text-purple-700 dark:text-purple-300 rounded-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  {g.name}
                </motion.span>
              ))}
            </div>
          )}

          <p className="text-gray-500 dark:text-gray-400">{comic.description || 'Tidak ada deskripsi.'}</p>

          <Link
            to={`/admin/comics/edit/${comic.id}`}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✏️ Edit Komik
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Daftar Chapter</h2>
          <Link
            to={`/admin/comics/${comic.id}/chapters/create`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Tambah Chapter
          </Link>
        </div>

        {chapters.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada chapter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 text-gray-800 dark:text-gray-200">#</th>
                  <th className="p-3 text-gray-800 dark:text-gray-200">Judul Chapter</th>
                  <th className="p-3 text-gray-800 dark:text-gray-200">Tanggal</th>
                  <th className="p-3 text-gray-800 dark:text-gray-200 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((ch, index) => (
                  <motion.tr
                    key={ch.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <td className="p-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{ch.title}</td>
                    <td className="p-3">
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs">
                        {new Date(ch.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <Link
                        to={`/admin/comics/${comic.id}/chapters/edit/${ch.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(ch.id)}
                        className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
