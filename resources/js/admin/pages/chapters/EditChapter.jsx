import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../axios';
import { showSuccess, showError } from '../../../src/utils/toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function EditChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', comic_id: null });
  const [images, setImages] = useState([]);      // gambar lama
  const [newImages, setNewImages] = useState([]); // file baru
  const [preview, setPreview] = useState([]);    // preview gambar baru
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/admin/chapters/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setForm({
        title: res.data.title,
        comic_id: res.data.comic_id
      });
      setImages(res.data.images || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageDelete = (imgId) => {
    if (!confirm('Yakin ingin menghapus gambar ini?')) return;

    axios.delete(`/api/admin/chapters/images/${imgId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setImages(prev => prev.filter(img => img.id !== imgId));
      showSuccess('Gambar dihapus');
    })
    .catch(() => showError('Gagal hapus gambar'));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreview(files.map(f => URL.createObjectURL(f)));
  };

  const removeNewImage = (index) => {
    const updatedFiles = [...newImages];
    const updatedPreview = [...preview];
    updatedFiles.splice(index, 1);
    updatedPreview.splice(index, 1);
    setNewImages(updatedFiles);
    setPreview(updatedPreview);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFiles = Array.from(newImages);
    const reorderedPrev = Array.from(preview);
    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    const [movedPrev] = reorderedPrev.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedFile);
    reorderedPrev.splice(result.destination.index, 0, movedPrev);
    setNewImages(reorderedFiles);
    setPreview(reorderedPrev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', form.title);
    newImages.forEach((file) => {
      data.append('images[]', file);
    });

    axios.post(`/api/admin/chapters/${id}?_method=PUT`, data, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      showSuccess('Chapter berhasil diupdate');
      navigate(`/admin/comics/${form.comic_id}`);
    })
    .catch(err => {
      console.error("Update error:", err.response?.data || err.message);
      showError('Gagal update chapter');
    });
  };

  if (loading) {
    return <div className="text-center text-white p-10">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="bg-gray-800 p-6 rounded-lg max-w-4xl mx-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Edit Chapter</h1>
          <Link
            to={`/admin/comics/${form.comic_id}`}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ⬅ Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Judul Chapter"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />

          {/* Gambar Lama */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Gambar Lama</h3>
            {images.length === 0 ? (
              <p className="text-gray-400">Tidak ada gambar</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map(img => (
                  <div key={img.id} className="relative group">
                    <img
                      src={`/storage/${img.image_path}`}
                      alt="Chapter Image"
                      className="rounded shadow border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(img.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Gambar Baru */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Tambah Gambar Baru</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImages}
              className="w-full bg-gray-700 text-white p-2 rounded"
            />

            {/* Preview */}
            {preview.length > 0 && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="newImages" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-wrap gap-3 mt-3"
                    >
                      {preview.map((src, idx) => (
                        <Draggable key={idx} draggableId={`file-${idx}`} index={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative w-32"
                            >
                              <img
                                src={src}
                                alt={`Preview ${idx}`}
                                className="w-32 h-40 object-cover rounded border border-gray-600"
                              />
                              {/* Tombol Hapus */}
                              <button
                                type="button"
                                onClick={() => removeNewImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow hover:bg-red-700"
                              >
                                ❌
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 rounded">
                                {idx + 1}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          <button className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
