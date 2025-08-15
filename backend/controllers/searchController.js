import Video from "../models/Video.js";

// Search videos by title
export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({ message: "Search query is required" });

    const videos = await Video.find({
      title: { $regex: q, $options: "i" }, 
    })
      .populate("uploader", "username")
      .populate("channelId", "channelName");

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Filter videos by category
export const filterVideos = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category)
      return res.status(400).json({ message: "Category is required" });

    const videos = await Video.find({ category })
      .populate("uploader", "username")
      .populate("channelId", "channelName");

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
