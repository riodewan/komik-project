import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CommentSection from "../components/CommentSection";

export default function ChapterReader() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/admin/chapters/${chapterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setChapter(res.data))
      .catch(() => setChapter(null))
      .finally(() => setLoading(false));
  }, [chapterId]);

  if (loading) {
    return (
      <div className="text-white bg-gray-900 min-h-screen flex items-center justify-center">
        Loading chapter...
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-white bg-gray-900 min-h-screen flex items-center justify-center">
        Chapter tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Header Top Bar */}
      <div className="bg-gray-900 sticky top-0 z-40 py-3 px-4 flex items-center justify-between shadow-md border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
        >
          ⬅️ Kembali
        </button>
        <h1 className="text-lg font-bold text-center truncate w-1/2">
          {chapter.comic?.title} - {chapter.title}
        </h1>
        <Link
          to="/"
          className="text-white text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
        >
          🏠 Beranda
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 flex-1">
        {/* Gambar halaman */}
        {chapter.images?.length > 0 ? (
          <div className="space-y-6">
            {chapter.images.map((img, i) => (
              <img
                key={img.id}
                src={`/storage/${img.image_path}`}
                alt={`Halaman ${i + 1}`}
                className="w-full rounded-lg shadow-lg"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Tidak ada halaman gambar.</p>
        )}

        <CommentSection chapterId={chapterId} />
      </div>

      {/* Floating Bottom Controls */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 bg-gray-800/80 px-6 py-3 rounded-full shadow-xl backdrop-blur">
        {chapter.previous_chapter && (
          <Link
            to={`/comics/${chapter.comic_id}/chapters/${chapter.previous_chapter.id}`}
            className="text-sm font-medium text-white hover:underline"
          >
            ⬅️ Prev
          </Link>
        )}
        <button
          onClick={() => setShowInfo(true)}
          className="text-sm font-medium text-white hover:underline"
        >
          ℹ️ Info
        </button>
        {chapter.next_chapter && (
          <Link
            to={`/comics/${chapter.comic_id}/chapters/${chapter.next_chapter.id}`}
            className="text-sm font-medium text-white hover:underline"
          >
            Next ➡️
          </Link>
        )}
      </div>

      {/* Popup Info Panel */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl relative shadow-xl">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-4 text-white text-2xl hover:text-red-400"
            >
              ✖
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={`/storage/${chapter.comic?.cover_image}`}
                alt={chapter.comic?.title}
                className="w-48 h-auto rounded-xl shadow"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{chapter.comic?.title}</h2>
                <p className="mb-4 text-sm text-gray-400">
                  {chapter.comic?.description || "Tidak ada deskripsi."}
                </p>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-white">
                  <div><span className="font-semibold">Translator:</span> Firza</div>
                  <div><span className="font-semibold">Proofreader:</span> Firza</div>
                  <div><span className="font-semibold">Typesetter:</span> Biruuu</div>
                  <div><span className="font-semibold">Quality:</span> Biruuu</div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-white text-sm">
                  <a href="#" className="hover:underline">🌐 Website</a>
                  <a href="#" className="hover:underline">💬 Discord</a>
                  <a href="#" className="hover:underline">💖 Donasi</a>
                  <a href="#" className="hover:underline">🎵 TikTok</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
