📚 Comic Management Admin Panel
Project ini adalah Admin Panel untuk mengelola data Komik, Chapter, Genre, dan User. Dibangun menggunakan React (Frontend) + Laravel API (Backend) dengan sistem autentikasi JWT dan role-based access control (RBAC).

✨ Features
✅ Login & Autentikasi JWT
✅ Manajemen User

Tambah / Edit / Hapus user
Role-based access (Admin, Editor, User)
✅ Manajemen Komik

Tambah / Edit / Hapus komik
Upload cover image
Multi-genre selection
CRUD Chapter per Komik
✅ Manajemen Genre

Tambah / Edit / Hapus genre
✅ Role Protection

Hanya Admin yang bisa akses halaman admin
Non-admin akan diarahkan ke halaman 403 Access Denied
✅ Modern UI

Dibangun dengan TailwindCSS
Dark mode ready
Notifikasi real-time dengan react-hot-toast
🛠️ Tech Stack
Frontend: React, React Router v6, Axios, TailwindCSS
Backend: Laravel 10 API + Sanctum/JWT
Database: MySQL
State Management: useState, useEffect
Notification: react-hot-toast
📌 Role Management
Admin: akses penuh semua halaman admin
Editor: akses terbatas (hanya data tertentu)
User: hanya bisa login tapi tidak bisa akses halaman admin (akan diarahkan ke 403)
🚀 Cara Menjalankan Project
###🔧 Backend (Laravel API)

cd backend composer install cp .env.example .env php artisan key:generate php artisan migrate --seed php artisan serve

💻 Frontend (React Admin Panel) cd frontend npm install npm run dev 🔒 Default Login Email: admin@gmail.com Password: admin Role: Admin

📷 Preview UI (Tambahkan screenshot UI di sini)

📜 License Project ini dibuat untuk keperluan pembelajaran & pengembangan internal.
