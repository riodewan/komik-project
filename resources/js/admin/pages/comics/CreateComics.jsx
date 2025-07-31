import { useState, useEffect } from 'react';
import axios from '../../../axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function CreateComic() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    author: '',
    artist: '',
    type: 'Manga',
    status: 'Ongoing',
    genre_ids: []
  });
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/genres', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => setGenres(res.data.data || res.data))
    .catch(() => {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak bisa memuat genre.',
        background: '#1f2937',
        color: '#fff'
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm({ ...form, genre_ids: selected });
  };

  const handleCover = (file) => {
    setCover(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      MySwal.fire({ icon: 'warning', title: 'Judul wajib diisi!', background: '#1f2937', color: '#fff' });
      return;
    }
    if (form.genre_ids.length === 0) {
      MySwal.fire({ icon: 'warning', title: 'Pilih minimal 1 genre!', background: '#1f2937', color: '#fff' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (let key in form) {
      if (key === 'genre_ids') {
        form.genre_ids.forEach(id => formData.append('genre_ids[]', id));
      } else {
        formData.append(key, form[key]);
      }
    }
    if (cover) formData.append('cover_image', cover);

    try {
      await axios.post('/api/admin/comics', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      MySwal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Komik berhasil ditambahkan.',
        background: '#1f2937',
        color: '#fff'
      }).then(() => navigate('/admin/comics'));
    } catch {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menambahkan komik.',
        background: '#1f2937',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow max-w-3xl mx-auto animate-dashboard-enter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tambah Komik</h1>
        <Link
          to="/admin/comics"
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
        >
          ⬅ Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={form.title}
          placeholder="Judul Komik"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          required
        />
        <textarea
          name="description"
          onChange={handleChange}
          value={form.description}
          placeholder="Deskripsi"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          rows={3}
        ></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="author"
            onChange={handleChange}
            value={form.author}
            placeholder="Author"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            name="artist"
            onChange={handleChange}
            value={form.artist}
            placeholder="Artist"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <select
          name="type"
          onChange={handleChange}
          value={form.type}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="Manga">Manga</option>
          <option value="Manhwa">Manhwa</option>
          <option value="Manhua">Manhua</option>
        </select>

        <select
          name="status"
          onChange={handleChange}
          value={form.status}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Hiatus">Hiatus</option>
        </select>

        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Pilih Genre</label>
          <select
            multiple
            onChange={handleGenreChange}
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100 h-40"
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Tekan CTRL/CMD + Klik untuk memilih banyak genre</p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCover(e.target.files[0])}
            className="block w-full text-sm"
          />
          {coverPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3"
            >
              <img src={coverPreview} alt="Preview" className="w-40 h-56 object-cover rounded shadow" />
            </motion.div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 text-white px-6 py-2 rounded shadow transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>}
            {loading ? 'Menyimpan...' : '💾 Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
