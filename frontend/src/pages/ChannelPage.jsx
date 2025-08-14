import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice.js";

export default function ChannelPage() {
  const { id: channelId } = useParams();
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

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await API.get(`/channels/${channelId}`);
        setChannel(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setChannel(null);
        } else {
          setError("Failed to load channel");
        }
      } finally {
        setLoading(false);
      }
    };

    if (channelId) {
      fetchChannel();
    } else {
      setLoading(false);
    }
  }, [channelId]);

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

      setChannel(res.data);

      // Update Redux + localStorage with new channelId
      const updatedUser = { ...user, channelId: res.data._id };
      dispatch(setCredentials({ user: updatedUser, token }));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
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

      // Refresh channel data
      const res = await API.get(`/channels/${channelId}`);
      setChannel(res.data);

      // Reset form
      setShowUploadForm(false);
      setTitle("");
      setVideoDescription("");
      setThumbnailUrl("");
      setVideoUrl("");
      setCategory("");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Subscribe / Unsubscribe
  const handleSubscribeToggle = async () => {
    try {
      const res = await API.post(
        `/channels/${channelId}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChannel((prev) => ({
        ...prev,
        subscribers: res.data.subscribers || prev.subscribers,
      }));
    } catch (err) {
      console.error("Subscribe error:", err);
      alert(err.response?.data?.message || "Error subscribing");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  // Show create form if no channel found
  if (!channel) {
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

  const isOwner =
    (channel.owner?._id && channel.owner._id === user?.id) ||
    (typeof channel.owner === "string" && channel.owner === user?.id);

  return (
    <div className="p-4">
      <div
        className="h-40 bg-gray-200 rounded-lg"
        style={{
          backgroundImage: `url(${channel.channelBanner || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <h1 className="text-2xl font-bold mt-4">{channel.channelName}</h1>
      <p className="text-gray-500">
        {channel.subscribers?.length || 0} subscribers
      </p>
      <p className="text-gray-600">{channel.description}</p>

      {/* Owner sees upload button, others see subscribe button */}
      {isOwner ? (
        <div className="mt-4">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            {showUploadForm ? "Cancel" : "Upload Video"}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <button
            onClick={handleSubscribeToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {channel.subscribers?.some(
              (sub) => sub.toString() === user?.id
            )
              ? "Unsubscribe"
              : "Subscribe"}
          </button>
        </div>
      )}

      {/* Upload form */}
      {showUploadForm && (
        <form
          onSubmit={handleUploadVideo}
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
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      )}

      {/* Videos */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Videos</h2>
        {channel.videos?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {channel.videos.map((video) => (
              <div key={video._id} className="bg-gray-100 rounded-lg p-2">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="rounded-lg"
                />
                <h3 className="text-sm font-medium mt-2">{video.title}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No videos yet</p>
        )}
      </div>
    </div>
  );
}
