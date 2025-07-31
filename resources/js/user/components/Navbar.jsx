import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-gray-950 text-white border-b border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="font-bold text-lg">Shinigami</span>
        </Link>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/explore" className="hover:text-purple-400 transition">Explore</Link>
          <Link to="/library" className="hover:text-purple-400 transition">Library</Link>
          <Link to="/search" className="hover:text-purple-400 transition">Search</Link>
        </div>

        {/* ✅ Search Bar (Desktop Only) */}
        <div className="flex-1 mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Komik..."
              className="w-full bg-gray-900 border border-gray-700 rounded-full px-4 py-1 text-sm text-white focus:outline-none"
            />
            <svg
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </div>
        </div>

        {/* ✅ Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded bg-gray-800 hover:bg-gray-700"
        >
          ☰
        </button>

        {/* ✅ Profile & Dark Mode */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* ✅ Profile Dropdown */}
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
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 flex flex-col gap-3">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <Link to="/explore" className="hover:text-purple-400">Explore</Link>
          <Link to="/library" className="hover:text-purple-400">Library</Link>
          <Link to="/search" className="hover:text-purple-400">Search</Link>
        </div>
      )}
    </nav>
  );
}
