import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Check if dist directory exists
const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

if (!fs.existsSync(distPath) || !fs.existsSync(indexPath)) {
  console.error("❌ Build files not found!");
  console.error(
    "Please run 'npm run build' first to create the dist directory."
  );
  console.error("Expected path:", indexPath);
  process.exit(1);
}

console.log("✅ Build files found, starting server...");

// Serve static files from the dist directory
app.use(
  express.static(distPath, {
    setHeaders: (res, filepath) => {
      if (filepath.endsWith(".js") || filepath.endsWith(".mjs")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (filepath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

// Handle React Router routes - serve index.html for all non-static routes
app.get("*", (req, res) => {
  // Double-check that index.html exists before serving
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send(`
      <html>
        <body>
          <h1>Server Error</h1>
          <p>Build files not found. Please ensure the application is built correctly.</p>
          <p>Expected file: ${indexPath}</p>
        </body>
      </html>
    `);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
