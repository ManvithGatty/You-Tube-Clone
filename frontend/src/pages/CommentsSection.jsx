import { useState } from "react";
import API from "../api/axios.js";
import { useSelector } from "react-redux";

export default function CommentsSection({ videoId, comments: initialComments }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const { token } = useSelector((state) => state.auth);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to comment");
      return;
    }
    try {
      const res = await API.post(`/comments/${videoId}`, { text: commentText });
      setCommentText("");
      // ✅ Update local state with new comments list from backend
      setComments(res.data);
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
        {comments.map((c, index) => (
          <div key={index} className="border-b pb-2">
            <p className="text-sm font-semibold">{c.userId?.username || "Anonymous"}</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
