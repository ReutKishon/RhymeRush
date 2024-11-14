const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      default: "Love",
    },
    maxPlayers: {
      type: Number,
      default: 4,
    },
    players: [{ type: mongoose.Schema.ObjectId, ref: "Player" }],
    gameOver: { type: Boolean, default: false },
    song: [{ type: mongoose.Schema.ObjectId, ref: "Sentence" }],
    currentTurn: { type: Number },
    limitedTimeTurn: {
      type: Number,
      required: [true, "A game must have a limited time for each turn"],
    },
    startTurn: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
