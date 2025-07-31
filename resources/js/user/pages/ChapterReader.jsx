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

      <div className="max-w-3xl mx-auto px-4 py-6 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">{chapter.title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded"
          >
            ⬅️ Kembali
          </button>
        </div>

        {/* Gambar halaman */}
        {chapter.images?.length > 0 ? (
          <div className="space-y-4">
            {chapter.images.map((img, i) => (
              <img
                key={img.id}
                src={`/storage/${img.image_path}`}
                alt={`Halaman ${i + 1}`}
                className="w-full rounded shadow"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Tidak ada halaman gambar.</p>
        )}

        {/* Navigasi Chapter */}
        <div className="mt-10 flex justify-between items-center gap-3">
          {chapter.previous_chapter ? (
            <Link
              to={`/comics/${chapter.comic_id}/chapters/${chapter.previous_chapter.id}`}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
            >
              ⬅️ {chapter.previous_chapter.title}
            </Link>
          ) : (
            <div />
          )}

          {chapter.next_chapter ? (
            <Link
              to={`/comics/${chapter.comic_id}/chapters/${chapter.next_chapter.id}`}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
            >
              {chapter.next_chapter.title} ➡️
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
          {/*    */}
      <Footer />
    </div>
  );
}
