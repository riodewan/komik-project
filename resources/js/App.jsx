// App.jsx (lengkap + react-toastify + GoogleCallback fix)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin
import Layout from "./admin/components/Layout";
import PrivateRoute from "./admin/components/PrivateRoute";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/users/Users";
import CreateUser from "./admin/pages/users/CreateUsers";
import EditUser from "./admin/pages/users/EditUsers";
import Comics from "./admin/pages/comics/Comics";
import CreateComic from "./admin/pages/comics/CreateComics";
import EditComic from "./admin/pages/comics/EditComics";
import ComicDetail from "./admin/pages/comics/ComicDetail";
import CreateChapter from "./admin/pages/chapters/CreateChapter";
import EditChapter from "./admin/pages/chapters/EditChapter";
import Genres from "./admin/pages/genres/Genres";
import CreateGenre from "./admin/pages/genres/CreateGenres";
import EditGenre from "./admin/pages/genres/EditGenres";
import Announcements from "./admin/pages/announcements/Announcements";
import CreateAnnouncement from "./admin/pages/announcements/CreateAnnouncement";
import EditAnnouncement from "./admin/pages/announcements/EditAnnouncement";

// User
import HomePage from "./user/pages/Home";
import ComicDetailHome from "./user/pages/HomeDetailComic";
import ChapterReader from "./user/pages/ChapterReader";
import AllAnnouncements from "./user/pages/AllAnnouncement";
import AnnouncementDetail from "./user/pages/AnnouncementDetail";
import Profile from "./user/pages/Profile";
import SearchPage from "./user/pages/SearchPage";
import Library from "./user/pages/Library";

// Auth & Errors
import Login from "./admin/pages/Login";
import Register from './admin/pages/Register';
import GoogleCallback from "./src/pages/GoogleCallback";
import Error404 from "./src/pages/Error404"; // ✅ disesuaikan

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* ==== USER SIDE ==== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/comics/:id" element={<ComicDetailHome />} />
        <Route path="/comics/:id/chapters/:chapterId" element={<ChapterReader />} />
        <Route path="/announcements" element={<AllAnnouncements />} />
        <Route path="/announcements/:id" element={<AnnouncementDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<Library />} />

        {/* ==== AUTH ==== */}
        <Route path="/login" element={<Login />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/register" element={<Register />} />

        {/* ==== ADMIN SIDE (PROTECTED) ==== */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="users" element={<Users />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />

          <Route path="comics" element={<Comics />} />
          <Route path="comics/create" element={<CreateComic />} />
          <Route path="comics/edit/:id" element={<EditComic />} />
          <Route path="comics/:id" element={<ComicDetail />} />

          <Route path="comics/:id/chapters/create" element={<CreateChapter />} />
          <Route path="comics/:id/chapters/edit/:chapterId" element={<EditChapter />} />

          <Route path="genres" element={<Genres />} />
          <Route path="genres/create" element={<CreateGenre />} />
          <Route path="genres/edit/:id" element={<EditGenre />} />

          <Route path="announcements" element={<Announcements />} />
          <Route path="announcements/create" element={<CreateAnnouncement />} />
          <Route path="announcements/edit/:id" element={<EditAnnouncement />} />
        </Route>

        {/* ==== FALLBACK ==== */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}
