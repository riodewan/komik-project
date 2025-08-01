// src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SearchPage() {
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sort, setSort] = useState("latest");
  const q = params.get("q") || "";

  useEffect(() => {
    axios.get("/api/admin/genres")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setGenres(data || []);
      })
      .catch((err) => {
        console.error("Gagal ambil genre:", err);
        setGenres([]);
      });
  }, []);

  useEffect(() => {
    if (q.length >= 2) {
      axios.get(`/api/search-comics?q=${encodeURIComponent(q)}&sort=${sort}&genres=${selectedGenres.join(",")}`)
        .then((res) => {
          const data = res.data.data || res.data;
          setResults(data);
        });
    }
  }, [q, sort, selectedGenres]);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((g) => g !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 flex-1">

        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 bg-gray-900 p-5 rounded-xl h-fit sticky top-6 shadow-md">
          <h2 className="text-lg font-bold mb-4 text-purple-400">Filter Genre</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 font-medium ${
                  selectedGenres.includes(genre.id)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-white">
              🔍 Hasil pencarian untuk: <span className="text-purple-400">"{q}"</span>
            </h1>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-900 border border-gray-700 px-3 py-2 rounded text-sm text-white focus:outline-none"
            >
              <option value="latest">Terbaru</option>
              <option value="popular">Terpopuler</option>
            </select>
          </div>

          {results.length === 0 ? (
            <p className="text-gray-400 text-sm">Tidak ada hasil ditemukan.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {results.map((comic) => (
                <div
                  key={comic.id}
                  className="bg-gray-900 rounded-xl overflow-hidden shadow group hover:shadow-lg transition duration-200"
                >
                  <img
                    src={`/storage/${comic.cover_image}`}
                    alt={comic.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-white line-clamp-2">{comic.title}</p>
                    <p className="text-xs text-gray-400">{comic.author || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
