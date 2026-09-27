const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
const httpServer = http.createServer(app);

/* =========================================================
   CORS
   ========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://studentcommunityportal-10.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS: Origin not allowed")
      );
    },
    credentials: true
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

/* =========================================================
   SOCKET.IO
   ========================================================= */

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    credentials: true
  }
});

/*
  Store currently connected users.

  userId -> Set of socket IDs
*/

const onlineUsers = new Map();

/* =========================================================
   SOCKET AUTHENTICATION
   ========================================================= */

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace(
        "Bearer ",
        ""
      );

    if (!token) {
      return next(
        new Error("Authentication token required")
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;

    next();
  } catch (error) {
    next(
      new Error(
        "Invalid or expired token"
      )
    );
  }
});

/* =========================================================
   SOCKET CONNECTION
   ========================================================= */

io.on("connection", (socket) => {
  const userId = socket.user.userId;

  console.log(
    `Socket connected: ${userId}`
  );

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(
      userId,
      new Set()
    );
  }

  onlineUsers
    .get(userId)
    .add(socket.id);

  /*
    Send current online users to this client
  */

  socket.emit(
    "online-users",
    Array.from(onlineUsers.keys())
  );

  /*
    Tell everyone that this user is online
  */

  io.emit(
    "user-online",
    userId
  );

  /* =======================================================
     REQUEST ONLINE USERS
     ======================================================= */

  socket.on(
    "get-online-users",
    () => {
      socket.emit(
        "online-users",
        Array.from(
          onlineUsers.keys()
        )
      );
    }
  );

  /* =======================================================
     DISCONNECT
     ======================================================= */

  socket.on(
    "disconnect",
    () => {
      console.log(
        `Socket disconnected: ${userId}`
      );

      const userSockets =
        onlineUsers.get(userId);

      if (userSockets) {
        userSockets.delete(
          socket.id
        );

        if (
          userSockets.size === 0
        ) {
          onlineUsers.delete(
            userId
          );

          io.emit(
            "user-offline",
            userId
          );
        }
      }
    }
  );
});

/* =========================================================
   MAKE SOCKET.IO AVAILABLE TO EXPRESS ROUTES
   ========================================================= */

app.set("io", io);

app.set(
  "onlineUsers",
  onlineUsers
);

/* =========================================================
   API ROUTES
   ========================================================= */

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

/* =========================================================
   ROOT API
   ========================================================= */

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Student Community Portal API is running",
      database:
        mongoose.connection.readyState === 1
          ? "connected"
          : "disconnected",
      socket: "enabled"
    });
  }
);

/* =========================================================
   404
   ========================================================= */

app.use(
  (req, res) => {
    res.status(404).json({
      message:
        "API route not found"
    });
  }
);

/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Server error:",
      error
    );

    res.status(500).json({
      message:
        "Internal server error"
    });
  }
);

/* =========================================================
   MONGODB CONNECTION
   ========================================================= */

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    const PORT =
      process.env.PORT || 5000;

    httpServer.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          `Socket.IO: enabled`
        );
      }
    );
  })
  .catch(
    (error) => {
      console.error(
        "MongoDB connection failed:"
      );

      console.error(
        error.message
      );

      process.exit(1);
    }
  );