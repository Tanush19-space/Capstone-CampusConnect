
const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getAttendanceReport
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("admin", "faculty"),
  markAttendance
);

router.get("/report", protect, authorize("admin"), getAttendanceReport);

module.exports = router;
