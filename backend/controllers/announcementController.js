
const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      audience: audience || "all",
      createdBy: req.user.id
    });

    // Send announcement to connected users
    const io = req.app.get("io");

    if (io) {
      const room = announcement.audience === "students"
  ? "student"
  : "faculty";

      if (announcement.audience === "all") {
         io.emit("newAnnouncement", announcement);
      } else {
        io.to(room).emit("newAnnouncement", announcement);
      }
    }

    res.status(201).json({
      success: true,
      message: "Announcement published successfully",
      announcement
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const role = req.user.role;

    const announcements = await Announcement.find({
      $or: [
        { audience: "all" },
        { audience: role === "student" ? "students" : role === "faculty" ? "faculty" : "all" }
      ]
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createAnnouncement, getAnnouncements };
