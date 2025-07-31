import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../axios';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Comics() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComics = () => {
    axios.get('/api/admin/comics', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setComics(res.data.data || res.data);
    })
    .catch(() => {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal memuat komik',
        text: 'Tidak dapat mengambil data komik.',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    })
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Hapus komik ini?',
      text: 'Tindakan ini tidak bisa dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      background: '#1f2937',
      color: '#fff'
    }).then(result => {
      if (result.isConfirmed) {
        axios.delete(`/api/admin/comics/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
          setComics(prev => prev.filter(c => c.id !== id));
          MySwal.fire({
            icon: 'success',
            title: 'Dihapus!',
            text: 'Komik berhasil dihapus.',
            background: '#1f2937',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
        })
        .catch(() => {
          MySwal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menghapus komik.',
            background: '#1f2937',
            color: '#fff',
            confirmButtonColor: '#ef4444'
          });
        });
      }
    });
  };

  useEffect(() => {
    fetchComics();
  }, []);

  return (
    <div className="animate-dashboard-enter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">📚 Daftar Komik</h1>
        <Link
          to="/admin/comics/create"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 px-4 py-2 rounded-lg text-white font-medium shadow transition"
        >
          + Tambah Komik
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
        </div>
      ) : comics.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          Belum ada komik.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {comics.map((comic) => (
              <motion.div
                key={comic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-purple-500/30 transition-all duration-300"
              >
                <div className="relative">
                  {comic.cover_image ? (
                    <img
                      src={`/storage/${comic.cover_image}`}
                      alt={comic.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 4v16m8-8H4" />
                      </svg>
                      No Cover
                    </div>
                  )}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs shadow 
                    ${comic.type === 'Manhwa'
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-500 text-black'}`}>
                    {comic.type}
                  </div>
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs shadow 
                    ${comic.status === 'Completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-500 text-black'}`}>
                    {comic.status}
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">
                    {comic.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate mb-3">{comic.author}</p>

                  {comic.genres && comic.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {comic.genres.slice(0, 3).map((g) => (
                        <span
                          key={g.id}
                          className="text-xs bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
                        >
                          {g.name}
                        </span>
                      ))}
                      {comic.genres.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{comic.genres.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-2">
                    <Link
                      to={`/admin/comics/edit/${comic.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/comics/${comic.id}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={() => handleDelete(comic.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
