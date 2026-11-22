import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "./services/api";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({
    courses: [],
    sections: [],
    announcements: [],
    attendance: []
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const [courseForm, setCourseForm] = useState({
  title: "",
  courseCode: "",
  description: "",
  credits: 3
});

const [announcementForm, setAnnouncementForm] = useState({
  title: "",
  message: "",
  audience: "all"
});

const [attendanceForm, setAttendanceForm] = useState({
  sectionId: "",
  studentId: "",
  date: new Date().toISOString().split("T")[0],
  status: "present"
});

const [actionMessage, setActionMessage] = useState("");

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data
  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        const [courses, sections, announcements, attendance] =
          await Promise.all([
            API.get("/courses", config),
            API.get("/sections", config),
            API.get("/announcements", config),
            API.get("/attendance", config)
          ]);

        setData({
          courses: courses.data.courses || [],
          sections: sections.data.sections || [],
          announcements: announcements.data.announcements || [],
          attendance: attendance.data.attendance || []
        });
      } catch (err) {
        console.error("Dashboard loading error:", err.response?.data || err);
      }
    };

    fetchData();
  }, [token, user]);

  // Socket.IO real-time announcements
  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token }
    });

    socket.on("newAnnouncement", (announcement) => {
      setNotification(announcement.title);
      setData((previous) => ({
        ...previous,
        announcements: [
          announcement,
          ...previous.announcements
        ]
      }));
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => socket.disconnect();
  }, [token]);

  // Logout
  const handleLogout = async () => {
    try {
      await API.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setData({
      courses: [],
      sections: [],
      announcements: [],
      attendance: []
    });
  };

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const createCourse = async (e) => {
  e.preventDefault();
  setActionMessage("");

  try {
    await API.post("/courses", courseForm, authConfig);
    setActionMessage("Course created successfully!");
    setCourseForm({
      title: "",
      courseCode: "",
      description: "",
      credits: 3
    });
    window.location.reload();
  } catch (err) {
    setActionMessage(
      err.response?.data?.message || "Course creation failed."
    );
  }
};

const publishAnnouncement = async (e) => {
  e.preventDefault();
  setActionMessage("");

  try {
    await API.post("/announcements", announcementForm, authConfig);
    setActionMessage("Announcement published successfully!");
    setAnnouncementForm({
      title: "",
      message: "",
      audience: "all"
    });
    window.location.reload();
  } catch (err) {
    setActionMessage(
      err.response?.data?.message || "Announcement failed."
    );
  }
};

const markAttendance = async (e) => {
  e.preventDefault();
  setActionMessage("");

  try {
    await API.post("/attendance", attendanceForm, authConfig);
    setActionMessage("Attendance marked successfully!");
    window.location.reload();
  } catch (err) {
    setActionMessage(
      err.response?.data?.message || "Attendance marking failed."
    );
  }
};

  // Login screen
  if (!token || !user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="brand-icon">CC</div>
          <h1>CampusConnect</h1>
          <p className="subtitle">Your campus, connected.</p>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="footer-text">
            Campus Management System
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>CampusConnect</h2>

        <div className="profile">
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{user.name}</strong>
            <p>{user.role}</p>
          </div>
        </div>

        <nav>
          <a href="#overview">Overview</a>
          <a href="#courses">Courses</a>
          <a href="#sections">Sections</a>
          <a href="#attendance">Attendance</a>
          <a href="#announcements">Announcements</a>
        </nav>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <p className="welcome">Welcome back,</p>
            <h1>{user.name}</h1>
          </div>
          <span className="role-tag">{user.role}</span>
        </header>

        {notification && (
          <div className="notification">
            New announcement: {notification}
            <button onClick={() => setNotification("")}>×</button>
          </div>
        )}

        <section id="overview">
          <h2>Dashboard Overview</h2>

          <div className="stats">
            <div className="stat-card">
              <span>Total Courses</span>
              <h2>{data.courses.length}</h2>
            </div>

            <div className="stat-card">
              <span>Total Sections</span>
              <h2>{data.sections.length}</h2>
            </div>

            <div className="stat-card">
              <span>Attendance Records</span>
              <h2>{data.attendance.length}</h2>
            </div>

            <div className="stat-card">
              <span>Announcements</span>
              <h2>{data.announcements.length}</h2>
            </div>
          </div>
        </section>

        {actionMessage && (
  <div className="notification">{actionMessage}</div>
)}

{user.role === "admin" && (
  <section className="content-section">
    <h2>Create Course</h2>

    <form className="action-form" onSubmit={createCourse}>
      <input
        placeholder="Course Title"
        value={courseForm.title}
        onChange={(e) =>
          setCourseForm({ ...courseForm, title: e.target.value })
        }
        required
      />

      <input
        placeholder="Course Code"
        value={courseForm.courseCode}
        onChange={(e) =>
          setCourseForm({ ...courseForm, courseCode: e.target.value })
        }
        required
      />

      <input
        placeholder="Description"
        value={courseForm.description}
        onChange={(e) =>
          setCourseForm({ ...courseForm, description: e.target.value })
        }
      />

      <input
        type="number"
        min="1"
        max="10"
        value={courseForm.credits}
        onChange={(e) =>
          setCourseForm({
            ...courseForm,
            credits: Number(e.target.value)
          })
        }
      />

      <button type="submit">Create Course</button>
    </form>
  </section>
)}

{["admin", "faculty"].includes(user.role) && (
  <>
    <section className="content-section">
      <h2>Publish Announcement</h2>

      <form className="action-form" onSubmit={publishAnnouncement}>
        <input
          placeholder="Announcement Title"
          value={announcementForm.title}
          onChange={(e) =>
            setAnnouncementForm({
              ...announcementForm,
              title: e.target.value
            })
          }
          required
        />

        <textarea
          placeholder="Write your announcement"
          value={announcementForm.message}
          onChange={(e) =>
            setAnnouncementForm({
              ...announcementForm,
              message: e.target.value
            })
          }
          required
        />

        <select
          value={announcementForm.audience}
          onChange={(e) =>
            setAnnouncementForm({
              ...announcementForm,
              audience: e.target.value
            })
          }
        >
          <option value="all">Everyone</option>
          <option value="students">Students</option>
          <option value="faculty">Faculty</option>
        </select>

        <button type="submit">Publish Announcement</button>
      </form>
    </section>

    <section className="content-section">
      <h2>Mark Attendance</h2>

      <form className="action-form" onSubmit={markAttendance}>
        <select
          value={attendanceForm.sectionId}
          onChange={(e) =>
            setAttendanceForm({
              ...attendanceForm,
              sectionId: e.target.value,
              studentId: ""
            })
          }
          required
        >
          <option value="">Select Section</option>
          {data.sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          ))}
        </select>

        <select
          value={attendanceForm.studentId}
          onChange={(e) =>
            setAttendanceForm({
              ...attendanceForm,
              studentId: e.target.value
            })
          }
          required
        >
          <option value="">Select Student</option>
          {data.sections
            .find((section) => section._id === attendanceForm.sectionId)
            ?.students?.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
        </select>

        <input
          type="date"
          value={attendanceForm.date}
          onChange={(e) =>
            setAttendanceForm({
              ...attendanceForm,
              date: e.target.value
            })
          }
          required
        />

        <select
          value={attendanceForm.status}
          onChange={(e) =>
            setAttendanceForm({
              ...attendanceForm,
              status: e.target.value
            })
          }
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <button type="submit">Mark Attendance</button>
      </form>
    </section>
  </>
)}

        <section id="courses" className="content-section">
          <h2>Courses</h2>
          {data.courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="item-grid">
              {data.courses.map((course) => (
                <div className="item-card" key={course._id}>
                  <h3>{course.title}</h3>
                  <p>Code: {course.courseCode}</p>
                  <p>Credits: {course.credits}</p>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="sections" className="content-section">
          <h2>Sections</h2>
          {data.sections.length === 0 ? (
            <p>No sections found.</p>
          ) : (
            <div className="item-grid">
              {data.sections.map((section) => (
                <div className="item-card" key={section._id}>
                  <h3>{section.name}</h3>
                  <p>
                    Course: {section.course?.title || "Not available"}
                  </p>
                  <p>
                    Faculty: {section.faculty?.name || "Not assigned"}
                  </p>
                  <p>
                    Students: {section.students?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="attendance" className="content-section">
          <h2>Attendance Records</h2>
          {data.attendance.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Section</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attendance.map((record) => (
                    <tr key={record._id}>
                      <td>
                        {record.student?.name || "Student"}
                      </td>
                      <td>
                        {record.section?.name || "Section"}
                      </td>
                      <td>
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="announcements" className="content-section">
          <h2>Latest Announcements</h2>
          {data.announcements.length === 0 ? (
            <p>No announcements available.</p>
          ) : (
            data.announcements.map((announcement) => (
              <div className="announcement-card" key={announcement._id}>
                <h3>{announcement.title}</h3>
                <p>{announcement.message}</p>
                <small>
                  Audience: {announcement.audience}
                </small>
              </div>
            ))
          )}
        </section>

        <footer>© 2026 CampusConnect | Campus Management System</footer>
      </main>
    </div>
  );
}

export default App;