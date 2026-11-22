
const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements
} = require("../controllers/announcementController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getAnnouncements);

router.post(
  "/",
  protect,
  authorize("admin", "faculty"),
  createAnnouncement
);

module.exports = router;
