const express = require("express");
const router = express.Router();

const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseAnalytics
} = require("../controllers/courseController");

const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, getCourses);
router.post("/", protect, authorize("admin"), createCourse);
router.put("/:id", protect, authorize("admin"), updateCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);
router.get("/analytics", protect, authorize("admin"), getCourseAnalytics);

module.exports = router;