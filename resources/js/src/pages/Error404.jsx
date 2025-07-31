export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Maaf, halaman yang kamu cari tidak tersedia.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
      >
        ⬅️ Kembali ke Beranda
      </a>
    </div>
  );
}
