
const Section = require("../models/Section");
const Course = require("../models/Course");
const User = require("../models/User");

// Create section
const createSection = async (req, res) => {
  try {
    const { name, course, faculty } = req.body;

    if (!name || !course || !faculty) {
      return res.status(400).json({
        success: false,
        message: "Name, course and faculty are required"
      });
    }

    const courseExists = await Course.findById(course);
    const facultyExists = await User.findOne({
      _id: faculty,
      role: "faculty"
    });

    if (!courseExists || !facultyExists) {
      return res.status(404).json({
        success: false,
        message: "Course or faculty not found"
      });
    }

    const section = await Section.create({
      name,
      course,
      faculty
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      section
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all sections
const getSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("course", "title courseCode")
      .populate("faculty", "name email")
      .populate("students", "name email");

    res.status(200).json({
      success: true,
      sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Enroll student
const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await User.findOne({
      _id: studentId,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: studentId } },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      section
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createSection,
  getSections,
  enrollStudent
};
