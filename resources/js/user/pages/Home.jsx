import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [selectedType, setSelectedType] = useState("manhwa");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comicRes, announcementRes, latestChapterRes] = await Promise.all([
          axios.get("/api/admin/comics", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get("/api/announcements"),
          axios.get("/api/last-chapters"),
        ]);

        const comicData = comicRes.data.data || comicRes.data;
        setComics(Array.isArray(comicData) ? comicData : []);
        setAnnouncements(Array.isArray(announcementRes.data) ? announcementRes.data : []);
        setUpdates(Array.isArray(latestChapterRes.data) ? latestChapterRes.data : []);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setComics([]);
        setAnnouncements([]);
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 flex-1">
        {/* Banner Carousel */}
        <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden mb-8">
          {comics.length > 0 ? (
            <img
              src={`/storage/${comics[0].cover_image}`}
              alt={comics[0].title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              Tidak ada banner
            </div>
          )}
          <div className="absolute bottom-0 bg-black/60 p-4 w-full">
            <h2 className="text-xl font-bold">{comics[0]?.title || "Banner"}</h2>
            <p className="text-sm text-gray-300 truncate">
              {comics[0]?.description || "Deskripsi singkat komik."}
            </p>
          </div>
        </div>

        {/* Pengumuman */}
        <div className="bg-gray-900 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">📢 Pengumuman</h3>
            <Link to="/announcements" className="text-sm text-blue-400 hover:underline">
              🔍 Lihat Semua Pengumuman
            </Link>
          </div>

          {announcements.length > 0 ? (
            <ul className="space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/announcements/${a.id}`}
                    className="flex items-start gap-3 hover:bg-gray-800 p-2 rounded-lg transition"
                  >
                    <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white">
                      📣
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{a.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(a.published_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Belum ada pengumuman.</p>
          )}
        </div>

        {/* Rekomendasi */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🔥 Rekomendasi</h2>
            <div className="flex gap-2">
              {["manhwa", "manga", "manhua"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-xs capitalize transition ${
                    selectedType === type
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pb-2">
              {comics
                .filter((comic) => comic.type?.toLowerCase() === selectedType)
                .slice(0, 8)
                .map((comic) => (
                  <Link
                    key={comic.id}
                    to={`/comics/${comic.id}`}
                    className="flex-shrink-0 w-36 relative group"
                  >
                    <img
                      src={`/storage/${comic.cover_image}`}
                      alt={comic.title}
                      className="w-full h-52 object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-0.5 rounded">
                      New
                    </div>
                    <div className="text-sm mt-2 font-semibold line-clamp-1">{comic.title}</div>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Update */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🆕 Update</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {updates.slice(0, 6).map((comic) => (
              <Link
                key={comic.id}
                to={`/comics/${comic.id}`}
                className="bg-gray-900 rounded-lg overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={`/storage/${comic.cover_image}`}
                    alt={comic.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-0.5 rounded">
                    {comic.latest_chapter?.title || "Ch. Terbaru"}
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">{comic.title}</p>
                  <p className="text-xs text-gray-400">
                    {comic.latest_chapter?.title || "Belum ada chapter"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
