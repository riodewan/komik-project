import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../axios";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length >= 2) {
        axios
          .get(`/api/search-comics?q=${encodeURIComponent(search)}`)
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setSearchResults(data || []);
            setShowDropdown(true);
          })
          .catch(() => setSearchResults([]));
      } else {
        setShowDropdown(false);
        setSearchResults([]);
      }
    }, 300); // delay 300ms

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (err) {
      console.error("Logout gagal:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-950 text-white relative border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Kiri */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://cdn.jsdelivr.net/gh/shinigamiscans/static@latest/emotes/3.webp" alt="Logo" className="h-8" />
            <span className="font-bold text-lg">SHINIGAMI ID</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-purple-400 transition">Home</Link>
            <Link to="/explore" className="hover:text-purple-400 transition">Explore</Link>
            <Link to="/library" className="hover:text-purple-400 transition">Library</Link>
            <Link to="/search" className="hover:text-purple-400 transition">Search</Link>
          </div>
        </div>

        {/* Tengah - Search */}
        <div className="relative w-full max-w-md mx-4 hidden md:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim()) {
                navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                setShowDropdown(false); // tidak perlu pakai dropdown
              }
            }}
            onFocus={() => search.length >= 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Cari komik..."
            className="w-full bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none text-white"
          />
          <span className="absolute top-2.5 right-3 text-gray-500 text-xs">Ctrl + K</span>

          {/* Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
              {searchResults.map((comic) => (
                <Link
                  key={comic.id}
                  to={`/comics/${comic.id}`}
                  className="flex gap-3 items-center p-3 hover:bg-gray-800 border-b border-gray-800"
                >
                  <img
                    src={`/storage/${comic.cover_image}`}
                    alt={comic.title}
                    className="w-12 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-semibold line-clamp-1">{comic.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{comic.author || "-"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Kanan - Mode, Auth, Menu */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold"
              >
                U
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-800">Profil</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-800">Pengaturan</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition">Login</Link>
              <Link to="/register" className="text-sm border border-purple-600 px-3 py-1 rounded hover:bg-purple-600 transition">Register</Link>
            </>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 flex flex-col gap-3">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <Link to="/explore" className="hover:text-purple-400">Explore</Link>
          <Link to="/library" className="hover:text-purple-400">Library</Link>
          <Link to="/search" className="hover:text-purple-400">Search</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-purple-400">Profil</Link>
              <Link to="/settings" className="hover:text-purple-400">Pengaturan</Link>
              <button onClick={handleLogout} className="text-left text-purple-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-400">Login</Link>
              <Link to="/register" className="hover:text-purple-400">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
