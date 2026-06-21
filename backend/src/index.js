import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import outreachRoutes from "./routes/outreachRoutes.js";
import trackerRoutes from "./routes/trackerRoutes.js";
const app = express();
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: env.NODE_ENV === "development" ? 1e4 : 100,
  message: { message: "Too many requests, please try again later." }
});
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/outreach", outreachRoutes);
app.use("/api/tracker", trackerRoutes);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});
const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`
\u{1F680} ColdMail AI Agent Server running on port ${env.PORT}`);
    console.log(`\u{1F4CA} Environment: ${env.NODE_ENV}`);
    console.log(`\u{1F517} Health check: http://localhost:${env.PORT}/api/health
`);
  });
};
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
