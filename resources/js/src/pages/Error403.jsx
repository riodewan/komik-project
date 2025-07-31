export default function Error403() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Kamu tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <a
        href="/login"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
      >
        🔑 Kembali ke Login
      </a>
    </div>
  );
}
