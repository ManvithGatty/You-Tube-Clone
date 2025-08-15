import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice.js";

export default function ChannelPage() {
  const { id: channelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form states
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelBanner, setChannelBanner] = useState("");
  const [creating, setCreating] = useState(false);

  // Upload form states
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  // Edit video states
  const [editVideoId, setEditVideoId] = useState(null);

  // Fetch channel
  const fetchChannel = async () => {
    try {
      const res = await API.get(`/channels/${channelId}`);
      setChannel(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Channel not found");
      } else {
        setError("Failed to load channel");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && !user?.channelId && channelId === user?.id) {
      setLoading(false);
      return;
    }

    if (!channelId || !/^[0-9a-fA-F]{24}$/.test(channelId)) {
      setError("Invalid channel ID");
      setLoading(false);
      return;
    }

    fetchChannel();
  }, [channelId, user]);

  // Create channel
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await API.post(
        "/channels",
        { channelName, description, channelBanner },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newChannelId = res.data._id;

      const updatedUser = { ...user, channelId: newChannelId };
      dispatch(setCredentials({ user: updatedUser, token }));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Navigate immediately to new channel page
      navigate(`/channel/${newChannelId}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  // Upload or update video
  const handleUploadOrUpdateVideo = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (editVideoId) {
        // Update
        await API.put(
          `/videos/${editVideoId}`,
          {
            title,
            description: videoDescription,
            thumbnailUrl,
            videoUrl,
            category,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Upload
        await API.post(
          "/videos",
          {
            title,
            description: videoDescription,
            thumbnailUrl,
            videoUrl,
            category,
            channelId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchChannel();
      setShowUploadForm(false);
      resetVideoForm();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await API.delete(`/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchChannel();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Prepare edit form
  const handleEditVideo = (video) => {
    setEditVideoId(video._id);
    setTitle(video.title);
    setVideoDescription(video.description || "");
    setThumbnailUrl(video.thumbnailUrl);
    setVideoUrl(video.videoUrl);
    setCategory(video.category || "");
    setShowUploadForm(true);
  };

  // Reset form
  const resetVideoForm = () => {
    setEditVideoId(null);
    setTitle("");
    setVideoDescription("");
    setThumbnailUrl("");
    setVideoUrl("");
    setCategory("");
  };

  // Subscribe toggle
  const handleSubscribeToggle = async () => {
    try {
      const res = await API.post(
        `/channels/${channelId}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChannel(res.data); // update full channel object
    } catch (err) {
      alert(err.response?.data?.message || "Error subscribing");
    }
  };

  const isOwner =
    (channel?.owner?._id && channel.owner._id === user?.id) ||
    (typeof channel?.owner === "string" && channel.owner === user?.id);

  if (loading) return <div className="p-4">Loading...</div>;

  // Create form view
  if (user?.id === channelId && !user?.channelId) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create Your Channel</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleCreateChannel} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Channel Name</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Channel Banner URL
            </label>
            <input
              type="text"
              value={channelBanner}
              onChange={(e) => setChannelBanner(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              placeholder="https://example.com/banner.jpg"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {creating ? "Creating..." : "Create Channel"}
          </button>
        </form>
      </div>
    );
  }

  // Error view
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  // Channel view
  return (
    <div className="p-4">
      <div
        className="h-40 bg-gray-200 rounded-lg"
        style={{
          backgroundImage: `url(${channel?.channelBanner || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <h1 className="text-2xl font-bold mt-4">{channel?.channelName}</h1>
      <p className="text-gray-600">{channel?.description}</p>

      {isOwner ? (
        <div className="mt-4">
          <button
            onClick={() => {
              resetVideoForm();
              setShowUploadForm(!showUploadForm);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {showUploadForm ? "Cancel" : "Upload Video"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSubscribeToggle}
            className={`px-4 py-2 rounded text-white transition ${
              channel?.subscriberIds?.includes(user?.id)
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {channel?.subscriberIds?.includes(user?.id)
              ? "Subscribed"
              : "Subscribe"}
          </button>
          <span className="text-gray-600 text-sm">
            {channel?.subCount || 0} subscriber
            {channel?.subCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {showUploadForm && (
        <form
          onSubmit={handleUploadOrUpdateVideo}
          className="mt-4 space-y-4 bg-gray-50 p-4 rounded"
        >
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Video Description"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {uploading
              ? editVideoId
                ? "Updating..."
                : "Uploading..."
              : editVideoId
              ? "Update Video"
              : "Upload Video"}
          </button>
        </form>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Videos</h2>
        {channel?.videos?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {channel.videos.map((video) => {
              const slug = video.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
              return (
                <div
                  key={video._id}
                  className="bg-gray-100 rounded-lg p-2 hover:shadow-md"
                >
                  <Link to={`/video/${video._id}/${slug}`}>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="rounded-lg"
                    />
                    <h3 className="text-sm font-medium mt-2">{video.title}</h3>
                  </Link>
                  {isOwner && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No videos yet</p>
        )}
      </div>
    </div>
  );
}
