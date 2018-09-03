const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tasks: [Schema.Types.ObjectId],
  private: {
    type: Boolean,
    default: false
  },
  description: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

module.exports = mongoose.model("Game", gameSchema);
