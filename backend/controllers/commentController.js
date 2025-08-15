import Video from "../models/Video.js";

// Add Comment
export const addComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.comments.push({ userId: req.user.id, text: req.body.text });
    await video.save();

    const updatedVideo = await Video.findById(req.params.videoId)
      .populate("comments.userId", "username avatar");

    res.status(201).json(updatedVideo.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit Comment
export const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text;
    await video.save();

    const updatedVideo = await Video.findById(req.params.videoId)
      .populate("comments.userId", "username avatar");

    res.json(updatedVideo.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = video.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await video.save();

    const updatedVideo = await Video.findById(req.params.videoId)
      .populate("comments.userId", "username avatar");

    res.json(updatedVideo.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
