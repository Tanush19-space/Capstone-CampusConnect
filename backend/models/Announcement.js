const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  audience: {
    type: String,
    enum: ["all", "students", "faculty"],
    default: "all"
  }
}, { timestamps: true });

announcementSchema.index({ audience: 1, createdAt: -1 });

module.exports = mongoose.model("Announcement", announcementSchema);