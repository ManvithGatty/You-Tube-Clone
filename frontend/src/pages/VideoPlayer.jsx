import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios.js";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import CommentsSection from "./CommentsSection.jsx";
import { Link } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${id}`);
        setVideo(res.data);
        setLikes(res.data.likes?.length || 0);
        setDislikes(res.data.dislikes?.length || 0);
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await API.post(`/videos/${id}/like`);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await API.post(`/videos/${id}/dislike`);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading video...</div>;
  if (!video) return <div className="p-4">Video not found</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Video player */}
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <iframe
          src={video.videoUrl}
          title={video.title}
          className="w-full h-[500px]"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video details */}
      <h1 className="text-xl font-bold mb-2">{video.title}</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          {video.channelId?._id ? (
            <Link
              to={`/channel/${video.channelId._id}`}
              className="text-xs text-gray-500 hover:underline hover:text-blue-600"
            >
              {video.channelId.channelName}
            </Link>
          ) : (
            <span className="text-xs text-gray-500">Unknown Channel</span>
          )}
          <p className="text-sm text-gray-500">
            {video.views} views •{" "}
            {new Date(video.uploadDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 hover:text-blue-500"
          >
            <MdThumbUp size={22} /> <span>{likes}</span>
          </button>
          <button
            onClick={handleDislike}
            className="flex items-center space-x-1 hover:text-red-500"
          >
            <MdThumbDown size={22} /> <span>{dislikes}</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6">{video.description}</p>

      {/* Comments */}
      <CommentsSection videoId={id} comments={video.comments || []} />
    </div>
  );
}
