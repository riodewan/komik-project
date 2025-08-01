📚 Comic Management Admin Panel
Panel Admin modern untuk mengelola Komik, Chapter, Genre, Pengumuman, dan User, lengkap dengan otentikasi JWT, Role-based Access Control (RBAC), dan antarmuka UI dark mode. Dibangun menggunakan React + Laravel API.

✨ Fitur Utama
🔐 Autentikasi & Role Management
✅ Login menggunakan JWT

✅ Role-Based Access Control:

Admin: akses penuh

Editor: akses terbatas

User: tidak bisa akses admin (403)

👥 Manajemen User
Tambah / Edit / Hapus User

Tetapkan Role: Admin, Editor, atau User

📖 Manajemen Komik
CRUD Komik (judul, deskripsi, cover, author, artist, type, status)

Upload cover image

Pilih banyak genre (multi-genre)

Tampilkan komik berdasarkan kategori Manga, Manhwa, dan Manhua

📄 Manajemen Chapter
CRUD Chapter per Komik

Penanda otomatis Chapter Terbaru di halaman Home

🏷️ Manajemen Genre
Tambah / Edit / Hapus genre

Relasi genre dengan komik

📢 Pengumuman
CRUD pengumuman

Pengumuman ditampilkan di homepage untuk semua user

🖼️ Halaman Utama (Home)
Carousel komik terbaru

Filter rekomendasi berdasarkan tipe komik

Komik dengan chapter terbaru ditampilkan di bagian update

Desain dark mode modern & minimalis

🛠️ Tech Stack
Layer	Teknologi
Frontend	React, React Router v6, TailwindCSS
Backend	Laravel 10 API
Autentikasi	JWT (sanctum opsional)
Database	MySQL
State	useState, useEffect
Notifikasi	react-hot-toast

🚀 Cara Menjalankan Project
🔧 Backend (Laravel API)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

💻 Frontend (React Admin Panel)
cd frontend
npm install
npm run dev

🔒 Default Login
mysql
Email:    admin@gmail.com
Password: password
Role:     Admin

📸 Preview UI
Home dengan Carousel, Pengumuman, Rekomendasi & Chapter Terbaru

Panel Admin untuk Komik, Chapter, Genre, dan User

UI Responsive & Dark Mode Friendly

📜 Lisensi
Proyek ini dibuat untuk pembelajaran dan pengembangan internal. Bebas digunakan untuk kebutuhan pribadi atau akademik.
