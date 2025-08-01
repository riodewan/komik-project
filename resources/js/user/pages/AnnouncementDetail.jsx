import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/announcements/${id}`)
      .then((res) => setAnnouncement(res.data))
      .catch((err) => {
        console.error("Gagal memuat detail:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Memuat...
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Pengumuman tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 py-8 flex-1"
      >
        {announcement.banner && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={`/storage/${announcement.banner}`}
            alt="Banner"
            className="rounded-xl mb-6 w-full object-cover shadow-lg"
          />
        )}

        <h1 className="text-2xl font-bold mb-2">{announcement.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {new Date(announcement.published_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="prose prose-invert max-w-none bg-gray-900 p-4 rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
        </div>

        <Link
          to="/"
          className="inline-block mt-10 text-blue-400 hover:underline"
        >
          ⬅ Kembali ke Home
        </Link>
      </motion.div>

      <Footer />
    </div>
  );
}
