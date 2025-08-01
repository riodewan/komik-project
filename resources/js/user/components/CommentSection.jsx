import { useEffect, useState } from "react";
import axios from "../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CommentSection({ chapterId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const token = localStorage.getItem("token");

  const fetchComments = () => {
    axios
      .get(`/api/chapters/${chapterId}/comments`)
      .then((res) => {
        const data = res.data.data || res.data;
        const sorted = sortComments(data);
        setComments(sorted);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  const sortComments = (arr) => {
    if (sort === "latest") {
      return [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    if (sort === "oldest") {
      return [...arr].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return arr;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios
      .post(
        `/api/comments`,
        { content: newComment, chapter_id: chapterId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        MySwal.fire({
          icon: "success",
          title: "Komentar dikirim!",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        setNewComment("");
        fetchComments(); // Refresh comment
      })
      .catch(() => {
        MySwal.fire({
          icon: "error",
          title: "Gagal kirim komentar",
          text: "Silakan coba lagi nanti",
        });
      });
  };

  useEffect(() => {
    fetchComments();
  }, [chapterId, sort]);

  return (
    <div className="mt-10 bg-gray-900 rounded-xl p-6 text-white">
      <h3 className="text-2xl font-semibold mb-4">💬 {comments.length} Komentar</h3>

      {token ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Tulis komentar..."
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 resize-none focus:outline-none text-white"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Kirim
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-400 mb-4">🔒 Login untuk mengirim komentar.</p>
      )}

      {/* Sort Option */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSort("latest")}
          className={`px-3 py-1 rounded text-sm ${
            sort === "latest" ? "bg-purple-600" : "bg-gray-800"
          }`}
        >
          Terbaru
        </button>
        <button
          onClick={() => setSort("oldest")}
          className={`px-3 py-1 rounded text-sm ${
            sort === "oldest" ? "bg-purple-600" : "bg-gray-800"
          }`}
        >
          Terlama
        </button>
      </div>

      {/* Daftar Komentar */}
      {loading ? (
        <p className="text-gray-400">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">Belum ada komentar.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => {
            if (!comment || !comment.id) return null; // Abaikan jika tidak valid

            return (
              <li key={comment.id || `comment-${index}`} className="bg-gray-800 p-4 rounded shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                    {comment.user?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{comment.user?.name || "User"}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-gray-200 whitespace-pre-line">{comment.content}</div>
                <div className="text-sm mt-2 text-gray-400 hover:underline cursor-pointer">
                  🔁 Reply
                </div>
              </li>
            );
          })}
        </ul>

      )}
    </div>
  );
}
