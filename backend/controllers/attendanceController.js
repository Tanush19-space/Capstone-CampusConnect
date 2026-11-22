const eventEmitter = require("../utils/eventEmitter");
const Attendance = require("../models/Attendance");
const Section = require("../models/Section");

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, sectionId, date, status } = req.body;

    if (!studentId || !sectionId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be present or absent"
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    if (req.user.role === "faculty" &&
        section.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this section"
      });
    }

    if (!section.students.some(id => id.toString() === studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in this section"
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        student: studentId,
        section: sectionId,
        date: new Date(date)
      },
      {
        student: studentId,
        section: sectionId,
        date: new Date(date),
        status
      },
      { new: true, upsert: true, runValidators: true }
    );

    eventEmitter.emit("attendanceMarked", {
  studentId,
  sectionId,
  status
});

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get attendance records
const getAttendance = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "student") {
      filter.student = req.user.id;
    } else if (req.user.role === "faculty") {
      const sections = await Section.find({
        faculty: req.user.id
      }).select("_id");

      filter.section = { $in: sections.map(s => s._id) };
    }

    if (req.query.sectionId) {
      filter.section = req.query.sectionId;
    }

    const records = await Attendance.find(filter)
      .populate("student", "name email")
      .populate("section", "name");

    res.status(200).json({
      success: true,
      count: records.length,
      records
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const report = await Attendance.aggregate([
      {
        $group: {
          _id: "$student",
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0]
            }
          },
          absentCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "absent"] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$presentCount", "$totalClasses"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $project: {
          _id: 0,
          studentName: "$student.name",
          email: "$student.email",
          totalClasses: 1,
          presentCount: 1,
          absentCount: 1,
          attendancePercentage: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: report.length,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceReport
};
