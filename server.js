const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const shortid = require("shortid");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/urlShortener");

// Define URL schema and model
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});
const Url = mongoose.model("Url", urlSchema);

// Set up Multer with custom storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp
    const uniqueName = `${Date.now()}-${path.basename(
      file.originalname,
      path.extname(file.originalname)
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Serve static files from the "public" directory
app.use(express.static("public"));

app.post("/upload", upload.array("files[]"), async (req, res) => {
  console.log(req.files); // Array of files
  // Respond with the unique URL of the first uploaded file
  const originalUrl = `http://localhost:3000/uploads/${req.files[0].filename}`;

  // Generate a short URL and save it to the database
  const shortUrl = shortid.generate();
  const url = new Url({ originalUrl, shortUrl });
  await url.save();

  res.send(
    `${
      req.protocol
    }://${req.get("host")}/${shortUrl}`
  );
});

// Redirect requests to the short URL to the original URL
app.get("/:shortUrl", async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("Short URL not found");
  }
});

// Serve uploaded files
app.get("/uploads/:filename", (req, res) => {
  const filepath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filepath);
});

app.listen(3000, () => console.log("Server started on port 3000"));
