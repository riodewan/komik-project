import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

function getTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "tahun", seconds: 31536000 },
    { label: "bulan", seconds: 2592000 },
    { label: "hari", seconds: 86400 },
    { label: "jam", seconds: 3600 },
    { label: "menit", seconds: 60 },
    { label: "detik", seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) {
      return `${interval} ${intervals[i].label} lalu`;
    }
  }

  return "Baru saja";
}

export default function HomeDetailComic() {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/admin/comics/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = res.data.data || res.data;
        setComic(data);
      })
      .catch(() => {
        setComic(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-white text-center p-10 bg-gray-900 min-h-screen">
        Memuat detail komik...
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="text-white text-center p-10 bg-gray-900 min-h-screen">
        Komik tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8"
      >
        <div className="w-full md:w-60">
          <img
            src={`/storage/${comic.cover_image}`}
            alt={comic.title}
            className="rounded-xl object-cover shadow-lg"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{comic.title}</h1>

          {/* Tombol Aksi */}
          <div className="flex gap-2 mb-4">
            <Link
              to={`/comics/${comic.id}/chapters/${comic.chapters?.[0]?.id || ''}`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              📖 Baca
            </Link>
            <button className="bg-gray-800 px-4 py-2 rounded-lg text-sm">⭐ Bookmark</button>
            <button className="bg-gray-800 px-4 py-2 rounded-lg text-sm">📚 Tambah ke Readlist</button>
          </div>

          <p className="text-sm text-gray-300 mb-4 line-clamp-4">{comic.description}</p>

          {/* Detail */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span><strong>Author:</strong> {comic.author || '-'}</span>
            <span><strong>Artist:</strong> {comic.artist || '-'}</span>
            <span><strong>Type:</strong> {comic.type}</span>
            <span><strong>Status:</strong> {comic.status}</span>
          </div>

          {/* Genre */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(comic.genres || []).map((genre) => (
              <span
                key={genre.id}
                className="bg-purple-700/30 text-purple-400 text-xs px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Daftar Chapter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 pb-20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📚 Chapter</h2>
        </div>

        {comic.chapters?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {comic.chapters
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/comics/${comic.id}/chapters/${chapter.id}`}
                    className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                  >
                    {/* Thumbnail */}
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={`/storage/${chapter.thumbnail || comic.cover_image}`}
                        alt={chapter.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm truncate">{chapter.title}</p>
                      <p className="text-xs text-gray-400">{getTimeAgo(chapter.created_at)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada chapter tersedia.</p>
        )}
      </motion.div>
      <Footer />
    </div>
  );
}
