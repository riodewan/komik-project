import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../axios';
import { showError, showSuccess } from '../../../src/utils/toast';

export default function EditComic() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    author: '',
    artist: '',
    status: 'Ongoing',
    genre_ids: [],
    cover_image: ''
  });

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreRes, comicRes] = await Promise.all([
          axios.get('/api/admin/genres', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`/api/admin/comics/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setGenres(genreRes.data.data || genreRes.data);

        const comic = comicRes.data.data || comicRes.data;
        setForm({
          title: comic.title,
          description: comic.description || '',
          author: comic.author || '',
          artist: comic.artist || '',
          status: comic.status || 'Ongoing',
          genre_ids: comic.genres ? comic.genres.map(g => g.id) : [],
          cover_image: comic.cover_image || ''
        });
      } catch (err) {
        console.error(err);
        alert('Gagal mengambil data komik');
        navigate('/admin/comics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
      await axios.post(`/api/admin/comics/${id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showSuccess('✅ Komik berhasil diupdate');
      navigate('/admin/comics');
    } catch (err) {
      console.error(err.response?.data);
      showError('❌ Gagal update komik');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Memuat data komik...</p>;

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow max-w-3xl mx-auto animate-dashboard-enter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Komik</h1>
        <Link
          to={`/admin/comics`}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
        >
          ⬅ Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Judul Komik"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          rows={3}
        ></textarea>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            name="artist"
            value={form.artist}
            onChange={handleChange}
            placeholder="Artist"
            className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Hiatus">Hiatus</option>
        </select>

        {/* ✅ Multi-select genre */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Pilih Genre</label>
          <select
            multiple
            value={form.genre_ids}
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

        {/* ✅ Cover lama + preview baru */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Cover Image</label>
          <input type="file" onChange={(e) => handleCover(e.target.files[0])} className="block w-full text-sm" />
          <div className="flex gap-4 mt-3">
            {form.cover_image && !coverPreview && (
              <img
                src={`/storage/${form.cover_image}`}
                alt="Cover Lama"
                className="w-32 h-48 object-cover rounded shadow"
              />
            )}
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview Baru"
                className="w-32 h-48 object-cover rounded shadow border-2 border-green-500"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:opacity-90 text-white px-6 py-2 rounded shadow transition"
          >
            💾 Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
