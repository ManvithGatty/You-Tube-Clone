import Channel from "../models/Channel.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Create a channel
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    const existingChannel = await Channel.findOne({ channelName });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel name already exists" });
    }

    const channel = new Channel({
      channelName,
      description,
      channelBanner,
      owner: req.user.id,
    });

    await channel.save();

    // Add channel to user's channels array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get channel details
export const getChannel = async (req, res) => {
  try {
    const channelId = req.params.id;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: "Invalid channel ID" });
    }

    const channel = await Channel.findById(channelId)
      .populate({
        path: "videos",
        select: "title thumbnailUrl views uploadDate"
      })
      .populate("owner", "username avatarUrl");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Shape the response to always include these fields
    res.json({
      _id: channel._id,
      channelName: channel.channelName,
      description: channel.description,
      channelBanner: channel.channelBanner,
      owner: channel.owner,
      videos: channel.videos,
      subscriberIds: channel.subscribers.map(id => id.toString()),
      subCount: channel.subscribers.length
    });
  } catch (err) {
    console.error("Error fetching channel:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Update channel
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(channel, req.body);
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete channel
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await channel.deleteOne();
    res.json({ message: "Channel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Subscribe / Unsubscribe toggle
export const toggleSubscribe = async (req, res) => {
  try {
    const { id: channelId } = req.params; // channel ID
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: "Invalid channel ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isSubscribed = channel.subscribers.some(
      (subscriberId) => subscriberId.toString() === userId
    );

    if (isSubscribed) {
      // Unsubscribe
      channel.subscribers = channel.subscribers.filter(
        (subscriberId) => subscriberId.toString() !== userId
      );
    } else {
      // Subscribe
      channel.subscribers.push(new mongoose.Types.ObjectId(userId));
    }

    await channel.save();

    // Populate owner for response
    const populatedChannel = await Channel.findById(channelId)
      .populate({
        path: "videos",
        select: "title thumbnailUrl views uploadDate"
      })
      .populate("owner", "username avatarUrl");

    res.json({
      _id: populatedChannel._id,
      channelName: populatedChannel.channelName,
      description: populatedChannel.description,
      channelBanner: populatedChannel.channelBanner,
      owner: populatedChannel.owner,
      videos: populatedChannel.videos,
      subscriberIds: populatedChannel.subscribers.map(id => id.toString()),
      subCount: populatedChannel.subscribers.length,
      subscribed: !isSubscribed
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


