import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiBookOpen, FiLayers, FiMenu, FiX, FiSpeaker } from 'react-icons/fi';

const menu = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={20} /> },
  { name: 'User', path: '/admin/users', icon: <FiUsers size={20} /> },
  { name: 'Comic', path: '/admin/comics', icon: <FiBookOpen size={20} /> },
  { name: 'Genre', path: '/admin/genres', icon: <FiLayers size={20} /> },
  { name: 'Pengumuman', path: '/admin/announcements', icon: <FiSpeaker size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex bg-gray-900 text-gray-100 w-64 flex-col">
        <div className="px-6 py-4 border-b border-gray-800 text-xl font-bold">📚 Komik Admin</div>
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all 
                  ${active ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 hover:text-white text-gray-300'}`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded"
        onClick={() => setOpen(true)}
      >
        <FiMenu size={22} />
      </button>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute top-0 left-0 w-64 h-full bg-gray-900 text-gray-100 p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">📚 Komik Admin</div>
              <button onClick={() => setOpen(false)}><FiX size={22} /></button>
            </div>
            <nav className="flex-1 space-y-2">
              {menu.map((item) => {
                const active = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${active ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 hover:text-white text-gray-300'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
