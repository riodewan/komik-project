// src/pages/LibraryPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const tabs = ["Bookmark", "Readlist", "History"];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("Readlist");
  const [readlist, setReadlist] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      axios
        .get("/api/library", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { bookmarks, readlist, history } = res.data;
          setBookmarks(bookmarks || []);
          setReadlist(readlist || []);
          setHistory(history || []);
        })
        .catch((err) => console.error("Gagal ambil library:", err));
    }
  }, []);

  const renderList = (list) =>
    list.length === 0 ? (
      <div className="text-gray-400 text-sm mt-10">Tidak ada data.</div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
        {list.map((comic) => (
          <Link
            to={`/comics/${comic.id}`}
            key={comic.id}
            className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg group"
          >
            <img
              src={`/storage/${comic.cover_image}`}
              alt={comic.title}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="p-3">
              <p className="text-sm font-semibold line-clamp-2">{comic.title}</p>
              <p className="text-xs text-gray-400">{comic.author || "-"}</p>
            </div>
          </Link>
        ))}
      </div>
    );

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10 flex-1">
        <h1 className="text-2xl font-bold mb-8">📚 Library Kamu</h1>

        {/* Tab */}
        <div className="flex gap-6 border-b border-gray-800 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-semibold pb-2 transition ${
                activeTab === tab
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Konten */}
        {!isAuthenticated ? (
          <div className="text-center mt-20">
            <img
              src="/assets/empty-login.png" // ganti dengan path kamu
              alt="Wajib Login"
              className="mx-auto w-32 mb-6"
            />
            <h2 className="text-xl font-bold mb-2">Wajib Login!</h2>
            <p className="text-gray-400 mb-6">
              Login dulu buat melihat {activeTab} kamu
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            {activeTab === "Bookmark" && renderList(bookmarks)}
            {activeTab === "Readlist" && renderList(readlist)}
            {activeTab === "History" && renderList(history)}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
