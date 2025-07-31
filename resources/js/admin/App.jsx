import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUsers';
import EditUser from './pages/users/EditUsers';
import Login from './pages/Login';
import Comics from './pages/comics/Comics';
import CreateComic from './pages/comics/CreateComics';
import EditComic from './pages/comics/EditComics';
import ComicDetail from './pages/comics/ComicDetail';
import CreateChapter from './pages/chapters/CreateChapter';
import EditChapter from './pages/chapters/EditChapter';
import Genres from './pages/genres/Genres';
import CreateGenre from './pages/genres/CreateGenres';
import EditGenre from './pages/genres/EditGenres';
import Error404 from '../src/pages/Error404';

export default function App() {
  return (
    <Router>
      {/* ✅ Toaster untuk semua halaman */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
      
      <Routes>
        <Route path="/admin" element={<PrivateRoute><Layout /></PrivateRoute>}>
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

        <Route path="/login" element={<Login />} />
        
        {/* Redirect semua route yang tidak dikenal ke dashboard */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}