const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  credits: {
    type: Number,
    default: 3
  }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);