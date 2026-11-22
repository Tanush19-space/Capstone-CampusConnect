
const Course = require("../models/Course");

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create course
const createCourse = async (req, res) => {
  try {
    const { title, courseCode, description, credits } = req.body;

    if (!title || !courseCode) {
      return res.status(400).json({
        success: false,
        message: "Title and course code are required"
      });
    }

    const course = await Course.create({
      title,
      courseCode,
      description,
      credits
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCourseAnalytics = async (req, res) => {
  try {
    const analytics = await Course.aggregate([
      {
        $lookup: {
          from: "sections",
          localField: "_id",
          foreignField: "course",
          as: "sections"
        }
      },
      {
        $addFields: {
          totalSections: { $size: "$sections" },
          totalEnrolledStudents: {
            $sum: {
              $map: {
                input: "$sections",
                as: "section",
                in: {
                  $size: { $ifNull: ["$$section.students", []] }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          courseCode: 1,
          credits: 1,
          totalSections: 1,
          totalEnrolledStudents: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: analytics.length,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseAnalytics
};
