/**
 * Demo 4: Read-only Node.js backend
 * 
 * Development-only server serving case data as REST endpoints.
 * Does NOT run in production (Exercise 2 deploy is static frontend only).
 * 
 * Endpoints:
 *   GET /api/case       → public/data/case.json
 *   GET /api/evidence   → public/data/evidence.json
 *   GET /api/people     → public/data/people.json
 *   GET /api/locations  → public/data/locations.json
 *   GET /api/timeline   → public/data/timeline.json
 * 
 * Testing controls (for Demos 7-10):
 *   ?delay=<ms>    → Artificial delay before responding (e.g. ?delay=3000)
 *   ?error=true    → Return 500 error instead of data
 * 
 * Example:
 *   npm run dev:backend
 *   curl http://localhost:3001/api/evidence?delay=2000&error=true
 */

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve JSON data files from public/data/
const dataDir = path.join(__dirname, "..", "public", "data");

const endpoints = ["case", "evidence", "people", "locations", "timeline"];

/**
 * Helper: Load and parse JSON file with optional artificial delay and error injection.
 */
async function loadData(filename, req) {
  const delay = parseInt(req.query.delay || "0", 10);
  const shouldError = req.query.error === "true";

  // Apply artificial delay
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Simulate error on demand
  if (shouldError) {
    const err = new Error("Simulated backend error (triggered by ?error=true)");
    err.statusCode = 500;
    throw err;
  }

  // Load and parse the JSON file
  const filePath = path.join(dataDir, filename);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

// Create endpoints for each data resource
endpoints.forEach((endpoint) => {
  app.get(`/api/${endpoint}`, async (req, res) => {
    try {
      const data = await loadData(`${endpoint}.json`, req);
      res.json(data);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      console.error(`[/api/${endpoint}]`, message);
      res.status(statusCode).json({ error: message });
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Demo 4: Read-Only Backend (Development Only)                 ║
╠════════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                      ║
║  Health check:      http://localhost:${PORT}/health                 ║
║                                                                ║
║  Endpoints:                                                    ║
║    GET /api/case                                              ║
║    GET /api/evidence                                          ║
║    GET /api/people                                            ║
║    GET /api/locations                                         ║
║    GET /api/timeline                                          ║
║                                                                ║
║  Testing (for Demos 7+):                                      ║
║    ?delay=<ms>    Artificial delay (e.g. ?delay=3000)         ║
║    ?error=true    Return 500 error                            ║
║                                                                ║
║  Example:                                                      ║
║    curl http://localhost:${PORT}/api/evidence?delay=2000           ║
║    curl http://localhost:${PORT}/api/people?error=true             ║
║                                                                ║
║  CORS enabled for frontend development on different port     ║
║  This server does NOT run in production (static build only)  ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
