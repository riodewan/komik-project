import { useEffect, useState } from "react";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function AllAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/announcements")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setAnnouncements(data || []);
      })
      .catch(err => {
        console.error("Gagal mengambil pengumuman:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">📢 Semua Pengumuman</h1>

        {loading ? (
          <div className="text-center py-20">Memuat...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-400">Tidak ada pengumuman tersedia.</div>
        ) : (
          <ul className="space-y-4">
            {announcements
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/announcements/${a.id}`}
                    className="block bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg hover:bg-gray-800 transition"
                  >
                    <h3 className="text-lg font-semibold line-clamp-1">{a.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">
                      {new Date(a.published_at || a.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-2">{a.content.replace(/<[^>]+>/g, "")}</p>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}
