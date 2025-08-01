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
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-950 sticky top-0 z-50 px-4 py-2 flex items-center justify-between shadow-md border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded"
        >
          ⬅ Kembali
        </button>
        <h1 className="text-base font-bold truncate w-1/2 text-center">
          {chapter.comic?.title} - {chapter.title}
        </h1>
        <Link
          to="/"
          className="text-white text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
        >
          🏠 Beranda
        </Link>
      </div>

      {/* Chapter Images */}
      <div className="flex-1 px-4 py-6 max-w-3xl mx-auto space-y-6">
        {chapter.images?.length > 0 ? (
          chapter.images.map((img, i) => (
            <img
              key={img.id}
              src={`/storage/${img.image_path}`}
              alt={`Halaman ${i + 1}`}
              className="w-full rounded-lg shadow-md border border-gray-800"
            />
          ))
        ) : (
          <p className="text-sm text-gray-400">Tidak ada halaman gambar.</p>
        )}

        {/* Komentar */}
        <CommentSection chapterId={chapterId} />
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex gap-4 bg-gray-900/90 px-6 py-3 rounded-full shadow-lg backdrop-blur">
        {chapter.previous_chapter && (
          <Link
            to={`/comics/${chapter.comic_id}/chapters/${chapter.previous_chapter.id}`}
            className="text-sm font-medium text-white hover:underline"
          >
            ⬅ Prev
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
            Next ➡
          </Link>
        )}
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full relative">
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
                className="w-44 h-auto rounded-lg shadow border border-gray-800"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{chapter.comic?.title}</h2>
                <p className="text-sm text-gray-400 mb-4">
                  {chapter.comic?.description || "Tidak ada deskripsi."}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Translator:</strong> Firza</div>
                  <div><strong>Proofreader:</strong> Firza</div>
                  <div><strong>Typesetter:</strong> Biruuu</div>
                  <div><strong>Quality:</strong> Biruuu</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
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
