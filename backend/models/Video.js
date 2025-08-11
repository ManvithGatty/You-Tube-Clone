import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, default: "" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    category: { type: String, default: "General" },
    uploadDate: { type: Date, default: Date.now },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
