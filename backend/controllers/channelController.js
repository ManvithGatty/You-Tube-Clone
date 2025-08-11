import Channel from "../models/Channel.js";
import User from "../models/User.js";

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
    const channel = await Channel.findById(req.params.id).populate(
      "owner",
      "username avatar"
    );
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
