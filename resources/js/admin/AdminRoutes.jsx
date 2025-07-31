import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/users/Users";
import CreateUser from "./pages/users/CreateUsers";
import EditUser from "./pages/users/EditUsers";
import Comics from "./pages/comics/Comics";
import CreateComic from "./pages/comics/CreateComics";
import EditComic from "./pages/comics/EditComics";
import ComicDetail from "./pages/comics/ComicDetail";
import CreateChapter from "./pages/chapters/CreateChapter";
import EditChapter from "./pages/chapters/EditChapter";
import Genres from "./pages/genres/Genres";
import CreateGenre from "./pages/genres/CreateGenres";
import EditGenre from "./pages/genres/EditGenres";

export default function AdminRoutes() {
  return (
    <PrivateRoute>
      <Routes>
        <Route path="/admin" element={<Layout />}>
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
          <Route path="comics/:id/chapters/edit/:id" element={<EditChapter />} />

          <Route path="genres" element={<Genres />} />
          <Route path="genres/create" element={<CreateGenre />} />
          <Route path="genres/edit/:id" element={<EditGenre />} />
        </Route>
      </Routes>
    </PrivateRoute>
  );
}
