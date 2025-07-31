import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/admin/comics", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      const data = res.data.data || res.data;
      setComics(Array.isArray(data) ? data : []);
    })
    .catch(err => {
      console.error("Gagal memuat komik:", err);
      setComics([]);
    })
    .finally(() => setLoading(false));
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
        {/* ✅ Banner Carousel */}
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

        {/* ✅ Pengumuman */}
        <div className="bg-gray-900 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold mb-2">📢 Pengumuman</h3>
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">A</div>
            <div>
              <p className="font-medium">Pengumuman Maintenance</p>
              <p className="text-xs text-gray-400">20 Juli 2025</p>
            </div>
          </div>
        </div>

        {/* ✅ Rekomendasi */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🔥 Rekomendasi</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-purple-600 rounded-full text-xs">Manhwa</button>
              <button className="px-3 py-1 bg-gray-800 rounded-full text-xs">Manga</button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {comics.slice(0, 8).map((comic) => (
              <Link
                key={comic.id}
                to={`/comics/${comic.id}`}
                className="flex-shrink-0 w-36 relative group"
              >
                <img
                  src={`/storage/${comic.cover_image}`}
                  alt={comic.title}
                  className="w-full h-52 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-0.5 rounded">New</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ✅ Update */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🆕 Update</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-purple-600 rounded-full text-xs">Project</button>
              <button className="px-3 py-1 bg-gray-800 rounded-full text-xs">Mirror</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {comics.slice(0, 6).map((comic) => (
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
                  <div className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-0.5 rounded">Ch. 1</div>
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">{comic.title}</p>
                  <p className="text-xs text-gray-400">Chapter 1</p>
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
