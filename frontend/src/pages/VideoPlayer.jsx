import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios.js";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import CommentsSection from "./CommentsSection.jsx";
import { useSelector } from "react-redux";

export default function VideoPlayer() {
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${id}`);
        setVideo(res.data);
        setLikes(res.data.likes?.length || 0);
        setDislikes(res.data.dislikes?.length || 0);
        setSubCount(res.data.subCount || 0);

        if (res.data.subscriberIds?.includes(user?.id)) {
          setSubscribed(true);
        }
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, user?.id]);

  const handleLike = async () => {
    try {
      const res = await API.post(
        `/videos/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await API.post(
        `/videos/${id}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    try {
      if (!video?.channelId?._id) return;
      const res = await API.post(
        `/channels/${video.channelId._id}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <div className="w-full flex justify-center mb-4">
        <div
          className="relative w-full"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

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

      <p className="mb-6">{video.description}</p>

      <CommentsSection videoId={id} comments={video.comments || []} />
    </div>
  );
}
