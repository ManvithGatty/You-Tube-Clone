import Video from "../models/Video.js";

// Like a video
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.likes = video.likes || [];
    video.dislikes = video.dislikes || [];

    // Remove user from dislikes
    video.dislikes = video.dislikes.filter(uid => uid.toString() !== req.user.id);

    // Toggle like
    if (video.likes.includes(req.user.id)) {
      video.likes = video.likes.filter(uid => uid.toString() !== req.user.id);
    } else {
      video.likes.push(req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Dislike a video
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.likes = video.likes || [];
    video.dislikes = video.dislikes || [];

    // Remove user from likes
    video.likes = video.likes.filter(uid => uid.toString() !== req.user.id);

    // Toggle dislike
    if (video.dislikes.includes(req.user.id)) {
      video.dislikes = video.dislikes.filter(uid => uid.toString() !== req.user.id);
    } else {
      video.dislikes.push(req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


