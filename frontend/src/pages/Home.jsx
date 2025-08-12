import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "./Sidebar.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div className="p-4">Loading videos...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <Link key={video._id} to={`/video/${video._id}`} className="cursor-pointer">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full rounded-lg"
            />
            <div className="mt-2 flex space-x-2">
              <div className="flex-shrink-0">
                <img
                  src="https://via.placeholder.com/40"
                  alt="channel"
                  className="rounded-full w-10 h-10"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500">{video.channelId?.channelName || "Unknown Channel"}</p>
                <p className="text-xs text-gray-500">
                  {video.views} views • {new Date(video.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
