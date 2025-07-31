import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../../axios';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function CreateChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setImages(fileArray);
    setPreview(fileArray.map(file => URL.createObjectURL(file)));
  };

  const handleFileChange = (e) => handleFiles(e.target.files);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const newFiles = [...images];
    const newPreview = [...preview];
    newFiles.splice(index, 1);
    newPreview.splice(index, 1);
    setImages(newFiles);
    setPreview(newPreview);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    const newImages = Array.from(images);
    const newPreview = Array.from(preview);

    const [movedImg] = newImages.splice(fromIndex, 1);
    const [movedPrev] = newPreview.splice(fromIndex, 1);

    newImages.splice(toIndex, 0, movedImg);
    newPreview.splice(toIndex, 0, movedPrev);

    setImages(newImages);
    setPreview(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      Swal.fire('Peringatan', 'Tambahkan minimal 1 gambar untuk chapter.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    images.forEach((img) => {
      formData.append('images[]', img);
    });

    try {
      setLoading(true);
      setUploadProgress(0);

      await axios.post(`/api/admin/comics/${id}/chapters`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Chapter berhasil ditambahkan.',
        confirmButtonColor: '#4f46e5'
      }).then(() => navigate(`/admin/comics/${id}`));
    } catch (err) {
      console.error(err.response?.data);
      Swal.fire('Error', 'Gagal menambahkan chapter.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Tambah Chapter</h1>
          <Link
            to={`/admin/comics/${id}`}
            className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
          >
            ⬅ Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2">Judul Chapter</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Masukkan judul chapter"
              required
            />
          </div>

          {/* Drag & Drop Upload */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
              dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 bg-gray-800/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-gray-300 mb-2">Tarik & letakkan gambar di sini</p>
            <p className="text-gray-500 text-sm mb-3">atau</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-block"
            >
              Pilih Gambar
            </label>
            {images.length > 0 && (
              <p className="text-gray-400 mt-3 text-sm">{images.length} gambar dipilih</p>
            )}
          </div>

          {preview.length > 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="preview-list" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4"
                  >
                    {preview.map((src, idx) => (
                      <Draggable key={idx} draggableId={`img-${idx}`} index={idx}>
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group"
                          >
                            <img
                              src={src}
                              alt={`Preview ${idx}`}
                              className="w-full h-40 object-cover rounded-lg border border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-xs px-1.5 py-0.5 rounded-full shadow"
                            >
                              ❌
                            </button>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {loading && (
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:to-purple-700 transition text-white px-8 py-3 rounded-lg font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? `Mengupload... ${uploadProgress}%` : 'Simpan Chapter'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
