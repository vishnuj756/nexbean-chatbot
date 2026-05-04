import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/authRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import userRoutes from "./src/routes/userRoutes.js"
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();

// 1. Manual CORS Handling (Must be first)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// 2. Body Parser (Only need this once)
app.use(express.json());

// __dirname fix (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger setup
const swaggerDoc = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// 3. Routes
app.use("/api", chatRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes)

// ✅ PROPER STARTUP FLOW
async function startServer() {
  try {
    await connectDB(); 

    // Use a variable for port so it's easy to change
    const PORT = 3000; 
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📄 Docs available at http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();