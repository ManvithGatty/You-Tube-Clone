import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios.js";

export default function SearchResults() {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get(`/videos/search?query=${encodeURIComponent(query)}`);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <div className="p-4">Searching...</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.length > 0 ? (
        videos.map((video) => (
          <Link
            key={video._id}
            to={`/video/${video._id}`}
            className="cursor-pointer"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full rounded-lg"
            />
            <h3 className="mt-2 text-sm font-semibold">{video.title}</h3>
            <p className="text-xs text-gray-500">
              {video.channelId?.channelName || "Unknown Channel"}
            </p>
          </Link>
        ))
      ) : (
        <p>No results found for "{query}"</p>
      )}
    </div>
  );
}
