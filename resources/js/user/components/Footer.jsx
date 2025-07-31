export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Shinigami ID. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4 text-xs">
          <a href="#" className="hover:text-purple-400">Tentang</a>
          <a href="#" className="hover:text-purple-400">Privasi</a>
          <a href="#" className="hover:text-purple-400">Kontak</a>
        </div>
      </div>
    </footer>
  );
}
