import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios.js";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import CommentsSection from "./CommentsSection.jsx";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${id}`);
        setVideo(res.data);
        setLikes(res.data.likes?.length || 0);
        setDislikes(res.data.dislikes?.length || 0);
        setSubCount(res.data.channelId?.subscribers?.length || 0);

        if (res.data.channelId?.subscribers?.includes(loggedInUserId)) {
          setSubscribed(true);
        }
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, loggedInUserId]);

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

  const handleSubscribe = async () => {
    try {
      if (!video?.channelId?._id) return;
      const res = await API.post(`/channels/${video.channelId._id}/subscribe`);
      setSubscribed(res.data.subscribed);
      setSubCount(res.data.subCount);
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
        <div className="flex items-center space-x-4">
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
          <span className="text-xs text-gray-500">{subCount} subscribers</span>
          <button
            onClick={handleSubscribe}
            className={`px-3 py-1 rounded text-white ${
              subscribed ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
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
