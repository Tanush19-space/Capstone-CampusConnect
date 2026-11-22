
const express = require("express");
const router = express.Router();

const {
  createSection,
  getSections,
  enrollStudent
} = require("../controllers/sectionController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getSections);
router.post("/", protect, authorize("admin"), createSection);
router.post("/:id/enroll", protect, authorize("admin"), enrollStudent);

module.exports = router;
