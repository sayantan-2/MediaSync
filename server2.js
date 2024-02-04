const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const shortid = require("shortid");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/urlShortener");

// Define URL schema and model
const urlSchema = new mongoose.Schema({
  originalFileNames: [String],
  originalUrls: [String],
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
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Serve static files from the "public" directory
app.use(express.static("public"));

app.post("/upload", upload.array("files[]"), async (req, res) => {
  const originalFileNames = req.files.map((file) => file.originalname);
  const originalUrls = req.files.map(
    (file) => `http://${req.get("host")}/uploads/${file.filename}`
  );

  const shortUrl = shortid.generate();
  const url = new Url({ originalFileNames, originalUrls, shortUrl });
  await url.save();

  res.send(`${req.protocol}://${req.get("host")}/${shortUrl}`);
});

// Redirect requests to the short URL to the original URL
app.get("/:shortUrl", async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (url) {
    fs.readFile("public/files.html", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server error");
      } else {
        let fileLinks = "";
        url.originalFileNames.forEach((originalFileName, i) => {
          const originalUrl = url.originalUrls[i];
          const ext = path.extname(originalFileName).slice(1);
          let logo = "";
          if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
            logo =
              '<img class="logo" src="/logos/image128.png" alt="Image file">';
          } else if (["pdf"].includes(ext)) {
            logo = '<img class="logo" src="/logos/pdf128.png" alt="PDF file">';
          } else if (["doc", "docx"].includes(ext)) {
            logo =
              '<img class="logo" src="/logos/doc-file128.png" alt="Word file">';
          } else if (["ppt", "pptx"].includes(ext)) {
            logo =
              '<img class="logo" src="/logos/ppt.png" alt="PowerPoint file">';
          } else if (["xls", "xlsx"].includes(ext)) {
            logo =
              '<img class="logo" src="/logos/xls-file.png" alt="Excel file">';
          } else if (["txt"].includes(ext)) {
            logo = '<img class="logo" src="/logos/txt128.png" alt="Text file">';
          } else if (
            ["py", "c", "java", "cpp", "class", "html", "css", "js"].includes(
              ext
            )
          ) {
            logo =
              '<img class="logo" src="/logos/html-file.png" alt="Text file">';
          } else {
            logo = '<img class="logo" src="/logos/file.png" alt="File">';
          }
          fileLinks += `<div class="file">
                          ${logo}
                          <p>${originalFileName}</p>
                          <a href="${originalUrl}" download>
                            <button>Download</button>
                          </a>
                        </div>`;
        });
        const filesDiv = `<div id="files">${fileLinks}</div>`;
        const html = data.replace('<div id="file-list"></div>', filesDiv);
        res.send(html);
      }
    });
  } else {
    res.status(404).send("Short URL not found");
  }
});

// Serve uploaded files
app.get("/uploads/:filename", (req, res) => {
  const filepath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filepath);
});

// app.listen(3000, () => console.log("Server started on port 3000"));
app.listen(3000, "192.168.137.165", () =>
  console.log("Server started on port 3000")
);
