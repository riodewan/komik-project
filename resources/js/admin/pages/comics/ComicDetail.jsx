import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../../axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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
    .catch(() => {
      Swal.fire('Error', 'Gagal mengambil data komik', 'error');
    });
  };

  const handleDeleteComic = () => {
    Swal.fire({
      title: 'Yakin ingin hapus komik?',
      text: 'Semua chapter akan ikut terhapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#e3342f',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/admin/comics/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
          Swal.fire('Terhapus!', 'Komik berhasil dihapus.', 'success');
          navigate('/admin/comics');
        })
        .catch(() => {
          Swal.fire('Error', 'Gagal menghapus komik.', 'error');
        });
      }
    });
  };

  const handleDeleteChapter = (chapterId) => {
    Swal.fire({
      title: 'Hapus Chapter?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      background: '#1f2937',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/admin/chapters/${chapterId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
          setChapters(prev => prev.filter(ch => ch.id !== chapterId));
          Swal.fire('Berhasil!', 'Chapter berhasil dihapus.', 'success');
        })
        .catch(() => {
          Swal.fire('Error', 'Gagal menghapus chapter.', 'error');
        });
      }
    });
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
        {comic.cover_image ? (
          <motion.img
            src={`/storage/${comic.cover_image}`}
            alt={comic.title}
            className="w-60 h-80 object-cover rounded-xl shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-60 h-80 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400">
            No Cover
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{comic.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Penulis:</strong> {comic.author || '-'}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Artist:</strong> {comic.artist || '-'}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-3"><strong>Type:</strong> {comic.type}</p>
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

          <div className="flex gap-3 mt-4">
            <Link
              to={`/admin/comics/edit/${comic.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ✏️ Edit Komik
            </Link>
            <button
              onClick={handleDeleteComic}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🗑️ Hapus Komik
            </button>
          </div>
        </div>
      </motion.div>

      {/* Daftar Chapter */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Daftar Chapter ({chapters.length})
          </h2>
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
