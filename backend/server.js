const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const eventEmitter = require("./utils/eventEmitter");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// EventEmitter listener
eventEmitter.on("attendanceMarked", (data) => {
  console.log("ATTENDANCE EVENT:", {
    student: data.studentId,
    section: data.sectionId,
    status: data.status,
    time: new Date().toLocaleString()
  });
});

const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(cors({
  origin: FRONTEND_URL
}));
app.use(express.json());
app.use(requestLogger);

// Socket authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(new Error("Invalid socket token"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.user.role);
  console.log(`${socket.user.role} connected to CampusConnect`);
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusConnect API is running",
    database: "Connected"
  });
});

// Handle unknown routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handler (must be last)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to CampusConnect API"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CampusConnect server is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusConnect running on port ${PORT}`);
  });
};

startServer();
