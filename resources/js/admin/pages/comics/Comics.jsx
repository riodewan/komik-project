import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import { showError } from '../../../src/utils/toast';

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
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!confirm('Yakin ingin menghapus komik ini?')) return;

    axios.delete(`/api/admin/comics/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setComics(prev => prev.filter(c => c.id !== id));
    })
    .catch(err => {
      console.error(err);
      showError('❌ Gagal menghapus komik');
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
          {comics.map((comic) => (
            <div
              key={comic.id}
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
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    No Cover
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs shadow">
                  {comic.status}
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">
                  {comic.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate mb-3">{comic.author}</p>

                {/* Badge Genre */}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
