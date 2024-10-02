const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Serve the index.html file when accessing the root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
