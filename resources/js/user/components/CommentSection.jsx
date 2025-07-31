import { useEffect, useState } from "react";
import axios from "../../axios";

export default function CommentSection({ comicId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    axios
      .get(`/api/comics/${comicId}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios
      .post(
        `/api/comics/${comicId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setComments((prev) => [res.data, ...prev]);
        setNewComment("");
      })
      .catch(() => alert("Gagal menambahkan komentar"));
  };

  useEffect(() => {
    fetchComments();
  }, [comicId]);

  return (
    <div className="mt-10 bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">💬 Komentar</h3>

      {/* Form Komentar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Tulis komentar..."
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 resize-none focus:outline-none"
        />
        <button
          type="submit"
          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
        >
          Kirim Komentar
        </button>
      </form>

      {/* Daftar Komentar */}
      {loading ? (
        <p className="text-gray-400">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">Belum ada komentar.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-800 p-4 rounded shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white">
                  {comment.user.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{comment.user.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-200">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
