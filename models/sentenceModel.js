const mongoose = require("mongoose");

const SentenceSchema = new mongoose.Schema(
  {
    content: {
      //generate in each game
      type: String,
      require: [true, "please provide a content"],
      validate: {
        validator: function (val) {
          // @ts-ignore
          return val != "" && val.split(" ").length == this.wordsCount;
        },
        message: "content can't be empty!",
      },
    },

    wordsCount: { type: Number, default: 6 }, // generate number on each turn
    player: { type: mongoose.Schema.ObjectId, ref: "Player" },
    timestamp: { type: Date, default: Date.now()},   
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Sentence = mongoose.model("Sentence", SentenceSchema);

module.exports = Sentence;
