import mongoose, { Schema } from "mongoose";

const songSchema = new Schema({
  name: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  lyrics: [
    {
      content: { type: String, required: true },
      playerId: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const SongModel = mongoose.model("Song", songSchema);

export default SongModel;
