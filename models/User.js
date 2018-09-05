const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: String,
  createdGames: [Schema.Types.ObjectId],
  games: [{type: Schema.Types.ObjectId, ref: "Game"}],
  uploads: [Object]
});

module.exports = mongoose.model("User", userSchema);
