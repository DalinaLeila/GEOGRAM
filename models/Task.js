const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  file: String,
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Task", taskSchema);
