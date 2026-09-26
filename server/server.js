const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// ==========================================
// CORS
// ==========================================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// ==========================================
// BODY PARSERS
// ==========================================
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/files",
  fileRoutes
);

// ==========================================
// API HOME
// ==========================================
app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
      "Student Community Portal API is running",

    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"

  });

});

// ==========================================
// 404
// ==========================================
app.use((req, res) => {

  res.status(404).json({
    message:
      "API route not found"
  });

});

// ==========================================
// MONGODB CONNECTION
// ==========================================
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB connected successfully"
    );

    const PORT =
      process.env.PORT || 5000;

    app.listen(
      PORT,
      () => {

        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `API: http://localhost:${PORT}`
        );

      }
    );

  })

  .catch((error) => {

    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );

    process.exit(1);

  });