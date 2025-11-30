import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // New Admin Route

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many auth attempts." });
const apiLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 1000, message: "Too many requests." });

// Swagger Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log("⚠️ Swagger YAML not found, skipping docs.");
}

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/transactions", apiLimiter, transactionRoutes);
app.use("/api/analytics", apiLimiter, analyticsRoutes);
app.use("/api/users", apiLimiter, userRoutes); // Admin route

app.get("/", (req, res) => res.json({ status: "API Running" }));

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();