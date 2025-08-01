import { useEffect, useState } from "react";
import axios from "../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CommentSection({ chapterId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // ID komentar yang dibalas
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");

  const token = localStorage.getItem("token");

  const fetchComments = () => {
    axios
      .get(`/api/chapters/${chapterId}/comments`)
      .then((res) => {
        const data = res.data.data || res.data;
        const structured = structureComments(data);
        const sorted = sortComments(structured);
        setComments(sorted);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  const structureComments = (flatComments) => {
    const map = {};
    flatComments.forEach(c => map[c.id] = { ...c, replies: [] });
    const roots = [];

    flatComments.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  const sortComments = (arr) => {
    return [...arr].sort((a, b) => {
      return sort === "latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios.post("/api/comments", {
      content: newComment,
      chapter_id: chapterId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setNewComment("");
      fetchComments();
    })
    .catch(() => {
      MySwal.fire("Gagal", "Gagal mengirim komentar", "error");
    });
  };

  const handleReplySubmit = (parentId) => {
    const content = replyContent[parentId]?.trim();
    if (!content) return;

    axios.post("/api/comments", {
      content,
      chapter_id: chapterId,
      parent_id: parentId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setReplyingTo(null);
      setReplyContent(prev => ({ ...prev, [parentId]: "" }));
      fetchComments();
    })
    .catch(() => {
      MySwal.fire("Gagal", "Gagal mengirim balasan", "error");
    });
  };

  useEffect(() => {
    fetchComments();
  }, [chapterId, sort]);

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`p-4 rounded bg-gray-800 mb-3 ${isReply ? 'ml-6' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
          {comment.user?.name?.charAt(0) || "?"}
        </div>
        <div>
          <p className="font-semibold">{comment.user?.name || "User"}</p>
          <p className="text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-gray-200 whitespace-pre-line">{comment.content}</p>

      {token && (
        <>
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-sm mt-2 text-gray-400 hover:underline"
          >
            🔁 Balas
          </button>

          {replyingTo === comment.id && (
            <div className="mt-2">
              <textarea
                rows={2}
                value={replyContent[comment.id] || ""}
                onChange={(e) =>
                  setReplyContent((prev) => ({ ...prev, [comment.id]: e.target.value }))
                }
                placeholder="Tulis balasan..."
                className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                >
                  Kirim Balasan
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Render replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-4 space-y-2">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-10 bg-gray-900 rounded-xl p-6 text-white">
      <h3 className="text-2xl font-semibold mb-4">💬 Komentar</h3>

      {token ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Tulis komentar..."
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 resize-none text-white"
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
        <p className="text-gray-400 mb-4">🔒 Login untuk mengirim komentar dan balasan.</p>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSort("latest")}
          className={`px-3 py-1 rounded text-sm ${sort === "latest" ? "bg-purple-600" : "bg-gray-800"}`}
        >
          Terbaru
        </button>
        <button
          onClick={() => setSort("oldest")}
          className={`px-3 py-1 rounded text-sm ${sort === "oldest" ? "bg-purple-600" : "bg-gray-800"}`}
        >
          Terlama
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400">Belum ada komentar.</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
