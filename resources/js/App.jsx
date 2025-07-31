import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./admin/AdminRoutes";
import HomePage from "./user/pages/Home";
import Login from "./admin/pages/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route utama user */}
        <Route path="/" element={<HomePage />} />

        {/* Route login */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Admin Routes sebagai elemen */}
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}
