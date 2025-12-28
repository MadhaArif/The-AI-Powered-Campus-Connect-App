import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
console.log("🚀 Starting app.js...");
import "dotenv/config";
import cors from "cors";
import connectDB from "./db/connectDB.js";

import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Cloudinary from "./src/utils/cloudinary.js";
import lmsRoutes from "./routes/lmsRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();
const server = createServer(app);

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: true, // Allow all origins by reflecting the request origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.pexels.com https://via.placeholder.com https://placehold.co https://randomuser.me",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' http://localhost:5000 http://localhost:5001 http://localhost:5173 http://127.0.0.1:5000 http://127.0.0.1:5001 http://127.0.0.1:5173 ws://localhost:5000 ws://localhost:5001 ws://127.0.0.1:5000 ws://127.0.0.1:5001",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=*, microphone=*");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧩 Connect MongoDB safely
connectDB();
Cloudinary();


// Removed: app.get("/", (req, res) => res.send("✅ API is working fine on Vercel"));

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mount routes with and without /api prefix for Vercel support
const routes = [
  { path: "/user", route: userRoutes },
  { path: "/company", route: companyRoutes },
  { path: "/job", route: jobRoutes },
  { path: "/recommendation", route: recommendationRoutes },
  { path: "/notification", route: notificationRoutes },
  { path: "/lms", route: lmsRoutes },
  { path: "/events", route: eventRoutes },
  { path: "/ats", route: atsRoutes },
  { path: "/resume", route: resumeRoutes },
  { path: "/", route: chatRoutes },
];

routes.forEach((r) => {
  app.use(r.path, r.route);
  app.use("/api" + r.path, r.route);
});

// Socket.io Logic
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Move this API check to a specific route
app.get("/api/status", (req, res) => res.send("✅ API is working fine"));

// Serve static files from the frontend dist directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle all other routes by serving index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;


// If we are in Heroku (or any environment where NODE_ENV=production),
// we might want to ensure we aren't just relying on VERCEL env var for listening.
// However, the existing logic:
// if (process.env.VERCEL) { ... } else { server.listen(...) }
// is actually fine for Heroku because Heroku doesn't set VERCEL=1.
// So it will fall into the else block and listen on process.env.PORT.
// No changes needed for this block specifically for Heroku compatibility.

if (process.env.VERCEL) {
  // Vercel serverless environment: export app, do not listen
  console.log("🚀 Running in Vercel Serverless Mode");
} else {
  // Local or standard server environment
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
