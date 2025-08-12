import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// Create Video
export const createVideo = async (req, res) => {
  try {
    const { title, thumbnailUrl, videoUrl, description, channelId, category } =
      req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Only channel owner can upload
    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const video = new Video({
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channelId,
      uploader: req.user.id,
    });

    await video.save();

    // Add video to channel's video list
    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all videos
// Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploader", "username")
      .populate({
        path: "channelId",
        select: "_id channelName",
        options: { strictPopulate: false }, // prevents errors if missing
      });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get video by ID
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username avatar")
      .populate("channelId", "channelName");
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(video, req.body);
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
