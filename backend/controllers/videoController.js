import mongoose from "mongoose";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// Create Video
export const createVideo = async (req, res) => {
  try {
    const { title, thumbnailUrl, videoUrl, description, channelId, category } =
      req.body;

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: "Invalid channel ID" });
    }

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

    if (!Array.isArray(channel.videos)) {
      channel.videos = [];
    }
    channel.videos.push(video._id);
    await channel.save();

    const updatedChannel = await Channel.findById(channelId)
      .populate({
        path: "videos",
        select: "title thumbnailUrl views uploadDate",
      })
      .populate("owner", "username avatarUrl");

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
      channel: updatedChannel,
    });
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploader", "username")
      .populate({
        path: "channelId",
        select: "_id channelName owner",
        populate: { path: "owner", select: "username avatar" }  
      });
    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get video by ID
export const getVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(req.params.id)
      .populate("uploader", "username avatar")
      .populate({
        path: "channelId",
        select: "channelName subscribers", // include subscribers
      })
      .populate("comments.userId", "username avatar");

    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({
      ...video.toObject(),
      subCount: video.channelId?.subscribers?.length || 0,
      subscriberIds: video.channelId?.subscribers?.map(id => id.toString()) || [],
    });
  } catch (err) {
    console.error("Error fetching video:", err);
    res.status(500).json({ message: err.message });
  }
};


// Update video
export const updateVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(video, req.body);
    await video.save();

    res.json(video);
  } catch (err) {
    console.error("Error updating video:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ message: err.message });
  }
};

// Search video
export const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .populate("uploader", "username avatar")
      .populate({
        path: "channelId",
        select: "_id channelName owner",
        populate: {
          path: "owner",
          select: "username avatar",
        },
      })
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get videos by category
export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({
      category: { $regex: category, $options: "i" },
    })
      .populate("uploader", "username avatar")
      .populate({
        path: "channelId",
        select: "_id channelName owner",
        populate: {
          path: "owner",
          select: "username avatar",
        },
      })
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos by category:", err);
    res.status(500).json({ message: "Server error" });
  }
};
