import { useState } from "react";
import API from "../api/axios.js";
import { useSelector } from "react-redux";

export default function CommentsSection({ videoId, comments: initialComments }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const { user, token } = useSelector((state) => state.auth);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to comment");
      return;
    }
    try {
      const res = await API.post(`/comments/${videoId}`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  // Save edit
  const handleEditComment = async (commentId) => {
    try {
      const res = await API.put(`/comments/${videoId}/${commentId}`, { text: editText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${videoId}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      <form onSubmit={handleAddComment} className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 && <p className="text-gray-500">No comments yet</p>}
        {comments.map((c) => (
          <div key={c._id} className="border-b pb-2">
            <p className="text-sm font-semibold">{c.userId?.username || "Anonymous"}</p>
            
            {editingCommentId === c._id ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => handleEditComment(c._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p>{c.text}</p>
            )}

            {user?.id === c.userId?._id && editingCommentId !== c._id && (
              <div className="flex space-x-2 text-xs mt-1">
                <button
                  onClick={() => startEdit(c)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
