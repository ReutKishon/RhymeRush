const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: [true, "Please provide a user name"],
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;
